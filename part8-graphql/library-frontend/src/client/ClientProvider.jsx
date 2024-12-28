import { ApolloProvider } from "@apollo/client";
import { client } from "./client";

export const ClientProvider = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
