import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { storage } from "./storage";

const httpLink = createHttpLink({
    uri: 'https://api.vrmarketing.guru/',
});

const authLink = setContext((_, { headers }) => {
    const token = typeof window !== "undefined" ?
                    storage.getToken() :
                    '';
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    uri: "https://api.vrmarketing.guru/",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
