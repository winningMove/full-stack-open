import { gql } from "@apollo/client";
import { AUTHOR_INFO, BOOK_INFO } from "./fragments";

export const ALL_AUTHORS = gql`
  query GetAllAuthors {
    allAuthors {
      ...AuthorInfo
    }
  }

  ${AUTHOR_INFO}
`;

export const ALL_BOOKS = gql`
  query GetAllBooks($genre: String) {
    allBooks(genre: $genre) {
      ...BookInfo
    }
    allGenres @client
  }

  ${BOOK_INFO}
`;

export const BOOK_ADDED = gql`
  subscription GetAddedBook {
    bookAdded {
      ...BookInfo
    }
  }

  ${BOOK_INFO}
`;
