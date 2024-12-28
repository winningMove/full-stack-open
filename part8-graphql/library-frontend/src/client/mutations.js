import { gql } from "@apollo/client";
import { AUTHOR_INFO, BOOK_INFO } from "./fragments";

export const CREATE_BOOK = gql`
  mutation CreateBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      ...BookInfo
    }
  }

  ${BOOK_INFO}
`;

export const SET_BIRTHYEAR = gql`
  mutation SetBirthYear($name: String!, $year: Int!) {
    editAuthor(name: $name, setBornTo: $year) {
      ...AuthorInfo
    }
  }

  ${AUTHOR_INFO}
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;
