import { Link } from "../domain/types";
import styles from "../styles/LinkCard.module.css";

interface LinkCardProps {
    link: Link,
    key: number
}

const LinkCard = (props: LinkCardProps) => {
    return(
        <div className={styles.card} key={props.key}>
            <div className={styles.cardTopSection} style={{
                fontStyle: props.link.description ? 'normal' : 'italic',
            }}>
                <a target="_blank" href={props.link.url} rel="noopener noreferrer">
                    {props.link.description ? props.link.description : '(no description)'}
                </a>
            </div>
            <div className={styles.cardBottomSection}>
                <button>upvote</button>

            </div>
        </div>
    );
};

export { LinkCard };