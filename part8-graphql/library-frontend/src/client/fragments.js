import { gql } from "@apollo/client";

export const AUTHOR_INFO = gql`
  fragment AuthorInfo on Author {
    name
    born
    bookCount
    id
  }
`;

export const BOOK_INFO = gql`
  fragment BookInfo on Book {
    title
    author {
      name
    }
    published
    genres
    id
  }
`;
