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
import { Input } from "antd";
import { LinkCard } from "../../components/LinkCard";
import styles from "../../styles/Feed.module.css";


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
    const [filter, setFilter] = useState<string>('');

    // todo: reconsider this
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isSignedIn, setIsSignedIn] = useState<boolean | undefined>(undefined);

    const getMoreLinks = async () => {
        const moreFeed = await getFilteredOrderedPaginatedLinks(
            filter, 10, feed.links.length
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

    // This probably messes up SSR (if any) but I don't see another way
    useEffect(() => {
        const user = storage.getUser();
        if (user) {
            setUser(user);
            setIsSignedIn(true);
        } else {
            setIsSignedIn(false);
        }
    }, []);

    return (
        <>
            <div className={styles.feedControlPanel}>
                Feed: {feed.count} post(s)
                <div>
                    <Input placeholder='filter results' onChange={(event) => {
                        setFilter(event.target.value);
                        getFilteredOrderedPaginatedLinks(event.target.value, 10, 0)
                            .then(data => setFeed(data));
                    }}/>
                </div>
            </div>
            {
                typeof isSignedIn !== "undefined" &&
                <InfiniteScroll
                    className={styles.infiniteScroll}
                    dataLength={feed.links.length}
                    next={getMoreLinks}
                    hasMore={hasMore}
                    loader={<h3>Loading...</h3>}
                    endMessage={<h3>You've reached the bottom of the feed</h3>}>
                    {
                        feed.links.map((link: Link, index) =>
                            <LinkCard link={link} key={index} user={user}/>)
                    }
                </InfiniteScroll>
            }
        </>
    );
};

export default Feed;
