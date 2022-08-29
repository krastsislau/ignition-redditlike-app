import { useState } from "react";
import { Link } from "../domain/types";
import { Dropdown, Space, Menu } from "antd";
import { SmartLink } from "./SmartLink";
import { UpvoteList } from "./UpvoteList";
import styles from "../styles/LinkCard.module.css";

interface LinkCardProps {
    link: Link,
    key: number
}

const LinkCard = (props: LinkCardProps) => {
    const [visible, setVisible] = useState<boolean>(false);

    const votes = props.link.votes.map((vote, index) => {
        return {
            key: index.toString(),
            label: vote.user.name
        }});

    const handleVisibleChange = (flag: boolean) => {
        setVisible(flag);
    };

    return(
        <div className={styles.card} key={props.key}>
            <div className={styles.cardTopSection} style={{
                fontStyle: props.link.description ? 'normal' : 'italic',
            }}>
                <SmartLink url={props.link.url}
                           label={props.link.description ?
                                  props.link.description :
                                  '(no description)'}/>
            </div>
            <div className={styles.cardBottomSection}>
                <button>upvote</button>
                <Dropdown overlay={
                    <Menu items={
                        props.link.votes.map((vote, index) => {
                            return {
                                key: index,
                                label: vote.user.name ? vote.user.name : '(no name)'
                            }
                        })}/>
                } onVisibleChange={handleVisibleChange} visible={visible}>
                    <a onClick={e => e.preventDefault()}>
                        <UpvoteList votes={props.link.votes}/>
                    </a>
                </Dropdown>

            </div>
        </div>
    );
};

export { LinkCard };