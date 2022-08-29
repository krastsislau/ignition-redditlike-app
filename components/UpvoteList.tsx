import { Vote } from "../domain/types";
import { Avatar } from "antd";
import styles from "../styles/UpvoteList.module.css";
import avatarStyles from "../styles/Avatar.module.css";

interface UpvoteListProps {
    votes: Array<Vote>,
}

const UpvoteList = (props: UpvoteListProps) => {
    const colors = ['lightsalmon', 'lightgreen', 'lightblue',
                    'lightcyan', 'lightgoldenrodyellow'];
    return(
        <div className={styles.UpvoteList}>
            {
                props.votes.length
                    ?
                    props.votes.slice(0, 3).map((vote, index) =>
                    <Avatar key={vote.id} className={avatarStyles.Avatar}
                            style={{
                                fontStyle: vote.user.name ? 'normal' : 'italic',
                                background: vote.user.name ? colors[vote.user.name[0].charCodeAt(0) % colors.length] :
                                                             'lightgray',
                            }}>
                        {vote.user.name ?
                            vote.user.name.charAt(0).toUpperCase() :
                            '?'}
                    </Avatar>)
                    :
                    'No upvotes'
            }
            {
                props.votes.length > 3 &&
                `${props.votes.length - 3} more upvote(s)`
            }
        </div>
    );
};

export { UpvoteList };
