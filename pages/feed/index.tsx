/*\
Ok, so this approach is using client-side rendering which is fine but not good.

The other, more SSR approach might be better (if it is possible).
Other possible solutions:
- https://swr.vercel.app/docs/pagination#useswrinfinite as mentioned in https://www.reddit.com/r/nextjs/comments/p7gjox/how_can_i_do_infinite_scrolling_in_next_with/
\*/

import {useEffect, useState} from "react";
import {useSubscription} from "@apollo/client";
import type {NextPage} from 'next';
import InfiniteScroll from "react-infinite-scroll-component";

import client from "../../apollo-client";
import {getFilteredOrderedPaginatedLinks} from "../../api/query";
import {Feed, Link, LinkSortRule, User, Vote} from "../../api/types";
import {LINKS_SUBSCRIPTION, VOTES_SUBSCRIPTION} from "../../api/subscription";
import {storage} from "../../storage";
import {Input, notification, Select} from "antd";
import {LinkCard} from "../../components/LinkCard";
import styles from "../../styles/Feed.module.css";

const { Search } = Input;
const { Option } = Select;

export async function getServerSideProps() {
    return getFilteredOrderedPaginatedLinks("", LinkSortRule.None, 20, 0)
        .then(data => {
            return {
                props: {
                    ...data,
                }
            }
        })
        .catch(err => {
            console.log(err);   // this runs on server tho
        });
}

const Feed: NextPage = (props: any) => {
    const [feed, setFeed] = useState<Feed>(props);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>('');
    const [linkSortRule, setLinkSortRule] = useState<LinkSortRule>(LinkSortRule.None);

    // todo: reconsider this
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isSignedIn, setIsSignedIn] = useState<boolean | undefined>(undefined);

    const {  } = useSubscription(
        LINKS_SUBSCRIPTION,
        {
            client,
            onSubscriptionData: options => {
                const link: Link = options.subscriptionData.data.newLink;
                notification.open({
                    message: 'New link has just been added!',
                    description:
                        `By ${link.postedBy.name}`,
                });
                if (link.description.includes(filter)) {
                    const linksCopy: Array<Link> = JSON.parse(JSON.stringify(feed.links));
                    switch (linkSortRule) {
                        case LinkSortRule.None:
                            if (!hasMore) {
                                linksCopy.push(link);
                            }
                            break;
                        case LinkSortRule.DescriptionAsc:
                            if (linksCopy[linksCopy.length-1].description > link.description) {
                                linksCopy.push(link);
                                linksCopy.sort((a, b) =>
                                    a.description < b.description ? -1 : 1);
                            }
                            break;
                        case LinkSortRule.DescriptionDesc:
                            if (linksCopy[linksCopy.length-1].description < link.description) {
                                linksCopy.push(link);
                                linksCopy.sort((a, b) =>
                                    a.description > b.description ? -1 : 1);
                            }
                            break;
                        case LinkSortRule.UrlAsc:
                            if (linksCopy[linksCopy.length-1].url > link.url) {
                                linksCopy.push(link);
                                linksCopy.sort((a, b) =>
                                    a.url < b.url ? -1 : 1);
                            }
                            break;
                        case LinkSortRule.UrlDesc:
                            if (linksCopy[linksCopy.length-1].url < link.url) {
                                linksCopy.push(link);
                                linksCopy.sort((a, b) =>
                                    a.url > b.url ? -1 : 1);
                            }
                            break;
                    }
                    setFeed(prev => ({
                        count: prev.count + 1,
                        links: linksCopy,
                    }));
                }
            },
        },
    );

    const {  } = useSubscription(
        VOTES_SUBSCRIPTION,
        {
            client,
            onSubscriptionData: options => {
                const vote: Vote = options.subscriptionData.data.newVote;
                if (user && vote.user.id === user.id) {
                    return;
                }
                notification.open({
                    message: 'New vote has just been added!',
                    description:
                        `By ${vote.user.name}`,
                });
                const votedLinkIndex = feed.links.findIndex(link => link.id === vote.link.id);
                if (votedLinkIndex === -1) {
                    return;
                } else {
                    console.log(vote)
                    setFeed(prev => ({
                        count: prev.count,
                        links: [
                            ...prev.links.slice(0, votedLinkIndex),
                            {
                                ...prev.links[votedLinkIndex],
                                votes: [
                                    ...prev.links[votedLinkIndex].votes,
                                    vote,
                                ]
                            },
                            ...prev.links.slice(votedLinkIndex + 1),
                        ]
                    }))
                }
            },
        },
    );

    const getMoreLinks = async () => {
        const moreFeed = await getFilteredOrderedPaginatedLinks(
            filter, linkSortRule, 10, feed.links.length
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
                <div className={styles.settingsContainer}>
                    <Search
                        placeholder="filter results"
                        allowClear
                        enterButton="search"
                        size="large"
                        onSearch={(value: string) => {
                            setFilter(value);
                            getFilteredOrderedPaginatedLinks(value, linkSortRule, 10, 0)
                                .then(data => {
                                    console.log(data);
                                    setFeed(data);
                                })
                                .catch(err => {
                                    notification['error']({
                                        message: 'Something went wrong!',
                                    });
                                });
                            setHasMore(true);
                        }}
                    />
                    <Select className={styles.sortRuleSelect} defaultValue="no sort rule" onChange={(value: string) => {
                        const stringsToLinkSortRules = {
                            "no sort rule": LinkSortRule.None,
                            "description asc": LinkSortRule.DescriptionAsc,
                            "description desc": LinkSortRule.DescriptionDesc,
                            "url asc": LinkSortRule.UrlAsc,
                            "url desc": LinkSortRule.UrlDesc,
                        }
                        // @ts-ignore
                        console.log(stringsToLinkSortRules[value])
                        // @ts-ignore
                        const newRule = stringsToLinkSortRules[value];
                        setLinkSortRule(newRule);
                        getFilteredOrderedPaginatedLinks(filter, newRule, 10, 0)
                            .then(data => {
                                console.log(data);
                                setFeed(data);
                            })
                            .catch(err => {
                                notification['error']({
                                    message: 'Something went wrong!',
                                });
                            });
                        setHasMore(true);
                    }}>
                        <Option value="no sort rule">no sort rule</Option>
                        <Option value="description asc">description asc</Option>
                        <Option value="description desc">description desc</Option>
                        <Option value="url asc">url asc</Option>
                        <Option value="url desc">url desc</Option>
                    </Select>
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
                        feed.links.map((link: Link) =>
                            <LinkCard link={link} key={link.id+link.votes.length} user={user}/>)
                    }
                </InfiniteScroll>
            }
        </>
    );
};

export default Feed;
