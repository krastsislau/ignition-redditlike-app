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
      }
    }`;

const VOTES_SUBSCRIPTION = gql`
    subscription {
      newVote {
        id
        link {
          url
          description
        }
        user {
          name
          email
        }
      }
    }`;

export { LINKS_SUBSCRIPTION, VOTES_SUBSCRIPTION };
