import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { jwtDecode } from "jwt-decode";

const validateToken = (token) => {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded?.exp < now) {
      console.error("Token expired");
      return null;
    }
    return decoded;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

export const tokenVar = makeVar(
  localStorage.getItem("library-user-token") || null
);
export const userVar = makeVar(validateToken(tokenVar()));
// a more thorough implementation would also auto-logout on token expiry,
// but this does not seem necessary for this exercise

export const filterGenre = makeVar(null);

export const login = (token) => {
  localStorage.setItem("library-user-token", token);
  tokenVar(token);
  const validUser = validateToken(token);
  userVar(validUser);

  if (!validUser) {
    logout();
  }
};

export const logout = () => {
  localStorage.removeItem("library-user-token");
  tokenVar(null);
  userVar(null);
  filterGenre(null);
  client.resetStore();
};

const authLink = setContext((_, { headers }) => {
  const token = tokenVar();
  return {
    headers: { ...headers, authorization: token ? `Bearer ${token}` : null },
  };
});
const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});
const wsLink = new GraphQLWsLink(createClient({ url: "ws://localhost:4000" }));

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === "OperationDefinition" && def.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        allGenres: {
          read(_, { readField }) {
            const allBooks =
              readField({ fieldName: "allBooks", args: { genre: null } }) || [];
            const allGenres = Array.from(
              new Set(
                allBooks.flatMap((book) =>
                  readField({ fieldName: "genres", from: book })
                )
              )
            );
            return allGenres;
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: splitLink,
  cache,
});

// helper functions for updating cache

export const updateBooksCache = (cache, query, bookAdded) => {
  cache.updateQuery(query, (cached) => {
    if (!cached?.allBooks) return null;
    return {
      allBooks: [...cached.allBooks, bookAdded],
    };
  });
};

export const updateAuthorsCache = (cache, query, bookAdded) => {
  cache.updateQuery(query, (cached) => {
    if (!cached?.allAuthors) return null;
    return {
      allAuthors: cached.allAuthors.map((author) =>
        author.name === bookAdded.author.name
          ? { ...author, bookCount: author.bookCount + 1 }
          : author
      ),
    };
  });
};
