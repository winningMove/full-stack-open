import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import DataLoader from "dataloader";
import e from "express";
import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import http from "http";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { WebSocketServer } from "ws";
import { JWT_SECRET, PORT } from "../config.js";
import Author from "../models/Author.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

const masterPassword = "MPWD";

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!,
    id: ID!,
    born: Int,
    bookCount: Int!
  } 

  type Book {
    title: String!,
    published: Int!,
    author: Author!,
    id: ID!,
    genres: [String!]!
  }

  type Query {
    bookCount: Int,
    authorCount: Int,
    allBooks(author: String, genre: String): [Book!]!,
    allAuthors: [Author!]!,
    me: User
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!
    ): Book!,
    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author,
    createUser(
      username: String!
      favoriteGenre: String!
    ): User,
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }    
`;

const getAuthorId = async (name) => {
  try {
    let author = await Author.findOne({ name }, "_id");
    if (!author) {
      author = await Author.create({ name });
    }
    return author.id;
  } catch (error) {
    throw new GraphQLError("Automatically adding new author failed", {
      extensions: {
        code: "BAD_USER_INPUT",
        error,
      },
    });
  }
};

const pubsub = new PubSub();
const createBookCountLoader = () =>
  new DataLoader(async (authorIds) => {
    const objectIds = authorIds.map((id) =>
      Types.ObjectId.createFromHexString(id)
    );
    const counts = await Book.aggregate([
      { $match: { author: { $in: objectIds } } },
      { $group: { _id: "$author", count: { $sum: 1 } } },
    ]);
    const countMap = counts.reduce((acc, el) => {
      acc[String(el._id)] = el.count;
      return acc;
    }, {});
    return authorIds.map((id) => countMap[String(id)] || 0);
  });

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments({}),
    authorCount: async () => Author.countDocuments({}),
    allBooks: async (_, { author, genre }) => {
      const filterConditions = {};
      if (author) {
        const authorDoc = await Author.findOne({ name: author }, "_id");
        if (authorDoc) filterConditions.author = authorDoc.id;
        else return [];
      }
      if (genre) filterConditions.genres = { $in: [genre] };
      return Book.find(filterConditions).populate("author");
    },
    allAuthors: async () => Author.find({}),
    me: (_, __, context) => context.currentUser,
  },
  Author: {
    bookCount: async (parent, _, context) => {
      if (!context.bookCountLoader)
        context.bookCountLoader = createBookCountLoader();
      return context.bookCountLoader.load(parent.id);
    },
  },
  Mutation: {
    addBook: async (_, args, context) => {
      // not atomic, valid author will be added even if book insertion fails
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const authorId = await getAuthorId(args.author);
      try {
        const newBook = await Book.create({ ...args, author: authorId });
        await newBook.populate("author");

        pubsub.publish("BOOK_ADDED", { bookAdded: newBook });

        return newBook;
      } catch (error) {
        throw new GraphQLError("Adding new book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },
    editAuthor: async (_, { name, setBornTo }, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const author = await Author.findOne({ name });
      if (!author) return null;

      author.born = setBornTo;
      return author.save();
    },
    createUser: async (_, args) => {
      try {
        return new User(args).save();
      } catch (error) {
        throw new GraphQLError("Creating user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user || password !== masterPassword) {
        throw new GraphQLError("Incorrect credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userInToken = {
        username: user.username,
        id: user.id,
        favoriteGenre: user.favoriteGenre,
      };

      return {
        value: jwt.sign(userInToken, JWT_SECRET, {
          expiresIn: "12h",
        }),
      };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

export const startServer = async () => {
  const app = e();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({ server: httpServer, path: "/" });
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/",
    cors(),
    e.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        try {
          const auth = req?.headers?.authorization;
          if (auth?.startsWith("Bearer ")) {
            const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
          }
        } catch (err) {
          return null;
        }
      },
    })
  );

  httpServer.listen(PORT || 4000, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
};
