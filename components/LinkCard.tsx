import { Link } from "../domain/types";
import { SmartLink } from "./SmartLink";
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
                <SmartLink url={props.link.url}
                           label={props.link.description ?
                                  props.link.description :
                                  '(no description)'}/>
            </div>
            <div className={styles.cardBottomSection}>
                <button>upvote</button>

            </div>
        </div>
    );
};

export { LinkCard };