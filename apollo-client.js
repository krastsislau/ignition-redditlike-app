import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://api.vrmarketing.guru/",
    cache: new InMemoryCache(),
});

export default client;
