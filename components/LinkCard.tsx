import { useEffect, useState } from "react";
import { User, Link, Vote } from "../api/types";
import { voteForLink } from "../api/mutation";

import { Dropdown, Menu, Switch } from "antd";
import { SmartLink } from "./SmartLink";
import { UpvoteList } from "./UpvoteList";
import styles from "../styles/LinkCard.module.css";

interface LinkCardProps {
    link: Link,
    user: User | undefined,
}

const LinkCard = (props: LinkCardProps) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [votes, setVotes] = useState<Array<Vote>>(props.link.votes);
    const [userUpvoted, setUserUpvoted] = useState<boolean>(false);

    const handleVisibleChange = (flag: boolean) => {
        setVisible(flag);
    };

    useEffect(() => {
        if (typeof props.user !== 'undefined' &&
            props.link.votes.map(vote => vote.user.id)
                .includes(props.user.id)) {
            setUserUpvoted(true);
        }
    }, [votes])

    return(
        <div className={styles.card}>
            <div className={styles.cardTopSection} style={{
                fontStyle: props.link.description ? 'normal' : 'italic',
            }}>
                <SmartLink url={props.link.url}
                           label={props.link.description ?
                                  props.link.description :
                                  '(no description)'}/>
            </div>
            <div className={styles.cardBottomSection}>
                <Switch checked={userUpvoted}
                        disabled={typeof props.user === 'undefined' || userUpvoted}
                        checkedChildren="upvoted"
                        unCheckedChildren="not upvoted"
                        style={{
                            width: 150,
                        }}
                        onChange={() => {
                            console.log(props.link)
                            voteForLink(props.link.id)
                                .then((data) => {
                                    console.log(data);
                                    setUserUpvoted(true);
                                    if (props.user) {
                                        setVotes([...votes, {
                                            id: data.id,
                                            link: data.link,
                                            user: {
                                                ...data.user,
                                                name: props.user?.name,
                                            }
                                        }]);
                                    }

                                })
                        }}/>
                <Dropdown overlay={
                    <Menu items={
                        votes.map((vote, index) => {
                            return {
                                key: index,
                                label: vote.user.name ? vote.user.name : '(no name)'
                            }
                        })}/>
                } onVisibleChange={handleVisibleChange} visible={visible}>
                    <a onClick={e => e.preventDefault()}>
                        <UpvoteList votes={votes}/>
                    </a>
                </Dropdown>

            </div>
        </div>
    );
};

export { LinkCard };