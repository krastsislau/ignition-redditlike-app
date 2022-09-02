import {gql} from "@apollo/client";

const LINKS_SUBSCRIPTION = gql`
    subscription {
      newLink {
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
    }`;

const VOTES_SUBSCRIPTION = gql`
    subscription {
      newVote {
        id
        link {
          id
        }
        user {
          id
          name
        }
      }
    }`;

export { LINKS_SUBSCRIPTION, VOTES_SUBSCRIPTION };
