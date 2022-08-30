import { ApolloClient, createHttpLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import {WebSocketLink} from "@apollo/client/link/ws";
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

const wsLink = typeof window !== "undefined" ?
    new WebSocketLink({
        uri: 'wss://api.vrmarketing.guru/graphql',
        options: {
            reconnect: true
        },
    }) :
    null;

const splitLink =
    typeof window !== "undefined" && wsLink != null ?
        split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink,
        authLink.concat(httpLink)) :
        authLink.concat(httpLink);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

export default client;
