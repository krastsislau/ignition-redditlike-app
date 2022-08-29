import { useState } from "react";
import type { NextPage } from 'next';
import InfiniteScroll from "react-infinite-scroll-component";

import { getAllLinks, getFilteredOrderedPaginatedLinks } from "../../domain/query";
import { signIn, signUp } from "../../domain/mutation";
import { Feed, Link } from "../../domain/types";

export async function getServerSideProps() {
    return getFilteredOrderedPaginatedLinks("", 10, 0)
        .then(data => {
            return { props: { ...data } }
        });
}

const Feed: NextPage = (props: any) => {
    const [feed, setFeed] = useState<Feed>(props);
    const [hasMore, setHasMore] = useState<boolean>(true);

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

    return (
        <InfiniteScroll
            dataLength={feed.links.length}
            next={getMoreLinks}
            hasMore={hasMore}
            loader={<h3>Loading...</h3>}
            endMessage={<h3>You've reached the bottom of the feed</h3>}>
                { feed.links.map((link: Link) => <div key={link.id} style={{
                    border: "red solid 1px",
                    height: 100
                }}>
                    { link.description }
                </div>) }
        </InfiniteScroll>
    );
};

export default Feed;
