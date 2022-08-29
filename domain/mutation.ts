import { gql } from "@apollo/client";
import client from "../apollo-client";
import { AuthPayload } from "./types";

// Sign up with email, password, and name and get token and user object.
// If error (email not unique), the caller catches it.
const signUp = async (email: string,
                      password: string,
                      name: string) : Promise<AuthPayload> => {
    return client.mutate({
        mutation: gql`
            mutation {
                signup(name: "${name}",
                       email: "${email}",
                       password: "${password}") {
                    token
                    user {
                        name
                    }
                }
            }`,
    }).then(res => res.data.signup);
};

// Sign in with email and password and get token and user object.
// If error (wrong credentials), the caller catches it.
const signIn = async (email: string,
                      password: string) : Promise<AuthPayload> => {
    return client.mutate({
        mutation: gql`
            mutation {
                login(email: "${email}",
                      password: "${password}") {
                    token
                    user {
                        name
                    }
                }
            }`,
    }).then(res => res.data.login);
};

// AUTH REQUIRED
// Create new link with url and description and get its id.
// If error (invalid token), the caller catches it.
const postNewLink = async (url: string, description: string) => {
    return client.mutate({
        mutation: gql`
            mutation {
                post(
                    url: "${url}",
                    description: "${description}") {
                        id
                }
            }`,
    }).then(res => res.data);
};

// AUTH REQUIRED
// Vote for a link with link id and get the vote's id.
// If error (invalid token | invalid linkId), the caller catches it.
const voteForLink = async (linkId: number) => {
    return client.mutate({
        mutation: gql`
            mutation {
                vote(linkId: "${linkId}") {
                    id
                }
            }`
    }).then(res => res.data);
};

export { signUp, signIn, postNewLink, voteForLink };
