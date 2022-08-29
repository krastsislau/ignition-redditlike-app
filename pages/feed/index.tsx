/*\
Ok, so this approach is using client-side rendering which is fine but not good.

The other, more SSR approach might be better (if it is possible).
Other possible solutions:
- https://swr.vercel.app/docs/pagination#useswrinfinite as mentioned in https://www.reddit.com/r/nextjs/comments/p7gjox/how_can_i_do_infinite_scrolling_in_next_with/
\*/

import { useEffect, useState } from "react";
import type { NextPage } from 'next';
import InfiniteScroll from "react-infinite-scroll-component";

import { getFilteredOrderedPaginatedLinks } from "../../domain/query";
import { Feed, Link, User } from "../../domain/types";
import { storage } from "../../storage";
import NextLink from "next/link";   // alt name bc conflict w domain/types/Link
import { LinkCard } from "../../components/LinkCard";
import styles from "../../styles/InfiniteScroll.module.css";

export async function getServerSideProps() {
    return getFilteredOrderedPaginatedLinks("", 10, 0)
        .then(data => {
            return {
                props: {
                    ...data,
                }
            }
        })
        .catch(err => console.log(err));
}

const Feed: NextPage = (props: any) => {
    const [feed, setFeed] = useState<Feed>(props);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [user, setUser] = useState<User | undefined>();

    const getMoreLinks = async () => {
        const moreFeed = await getFilteredOrderedPaginatedLinks(
            "", 10, feed.links.length
        );
        console.log(moreFeed);
        if (moreFeed.links.length === 0) {
            setHasMore(false);
        } else {
            setFeed(prev => ({
                count: prev.count,
                links: [...prev.links, ...moreFeed.links],
            }));
        }
    };

    useEffect(() => {
        const user = storage.getUser();
        if (user) {
            setUser(user);
        }
    }, []);

    return (
        <>
            { /* tmp div below */ }
            <div style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                background: 'white',
                height: 100,
                border: "black solid 4px",
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
            }}>
                You are {user ? `signed in as ${user.name}` : 'not signed in'}.
                {
                    user &&
                    <NextLink href='/new-post'>Create a post</NextLink>
                }
            </div>
            <InfiniteScroll
                className={styles.infiniteScroll}
                dataLength={feed.links.length}
                next={getMoreLinks}
                hasMore={hasMore}
                loader={<h3>Loading...</h3>}
                endMessage={<h3>You've reached the bottom of the feed</h3>}>
                    {
                        feed.links.map((link: Link, index) =>
                            <LinkCard link={link} key={index}/>)
                    }
            </InfiniteScroll>
        </>
    );
};

export default Feed;
