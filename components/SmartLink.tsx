interface SmartLinkProps {
    url: string,
    label: string,
}

// not IDEAL but covers 99% of cases
const SmartLink = (props: SmartLinkProps) => {
    const regEx = /^http/;

    return regEx.test(props.url) ?
        <a target="_blank" rel="noopener noreferrer"
           href={props.url}>{props.label}</a> :
        <a target="_blank" rel="noopener noreferrer"
           href={`https://${props.url}`}>{props.label}</a>;
};

export { SmartLink };
