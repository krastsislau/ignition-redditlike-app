import { gql } from "@apollo/client";
import client from "../apollo-client";
import { Feed } from "./types";

// Just get all links with all the info
const getAllLinks = async () : Promise<Feed> => {
    return client.query({
        query: gql`
            query {
              feed {
                count
                links {
                  id
                  description
                  url
                  postedBy {
                    id
                    name
                  }
                  votes {
                    id
                    user {
                      id
                      name
                    }
                  }
                }
              }
            }
        `,
    }).then(res => res.data);
}

// Get filtered, ordered, and paginated links
const getFilteredOrderedPaginatedLinks =
    async (pattern: string,
           // todo: add order rules
           take: number,
           skip: number) : Promise<Feed> => {
    return client.query({
        query: gql`
            query {
              feed(take: ${take}, skip: ${skip}, filter: "${pattern}") {
                count
                links {
                  id
                  description
                  url
                  postedBy {
                    id
                    name
                  }
                  votes {
                    id
                    user {
                      id
                      name
                    }
                  }
                }
              }
            }
        `,
    }).then(res => res.data.feed);
}

export { getAllLinks, getFilteredOrderedPaginatedLinks };
