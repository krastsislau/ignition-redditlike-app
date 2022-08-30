import {gql} from "@apollo/client";
import client from "../apollo-client";
import {Feed, LinkSortRule} from "./types";

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

// dunno if this is a good way to do this
// but enum values are not accepted as keys
const linkSortRuleToGql = {
    0: '',
    1: 'description: asc',
    2: 'description: desc',
    3: 'url: asc',
    4: 'url: desc',
}

// Get filtered, ordered, and paginated links
// Include only the info required to display links in feed
const getFilteredOrderedPaginatedLinks =
    async (pattern: string,
           sortRule: LinkSortRule,
           take: number,
           skip: number) : Promise<Feed> => {
    return client.query({
        query: gql`
            query {
              feed(take: ${take}, skip: ${skip}, filter: "${pattern}",
                   orderBy: { ${linkSortRuleToGql[sortRule]} }) {
                count
                links {
                  id
                  description
                  url
                  postedBy {
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
