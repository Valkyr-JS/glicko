import { ApolloClient, InMemoryCache } from "@apollo/client";

const uri =
  (import.meta.env.MODE === "development"
    ? import.meta.env.VITE_STASH_SERVER
    : "") + "/graphql";

const client = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
});

export default client;
