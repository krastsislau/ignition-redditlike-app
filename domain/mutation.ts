import { gql } from "@apollo/client";
import client from "../apollo-client";
import { AuthPayload } from "./types";

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
                }
            }`,
    }).then(res => res.data.signup);
}

const signIn = async (email: string,
                      password: string) : Promise<AuthPayload> => {
    return client.mutate({
        mutation: gql`
            mutation {
                login(email: "${email}",
                      password: "${password}") {
                    token
                }
            }`,
    }).then(res => res.data.login);
}

export { signUp, signIn };
