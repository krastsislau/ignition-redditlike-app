import React from "react";
import type { NextPage } from 'next';
import { Input } from 'antd';
import styles from "../../styles/Form.module.css";

import { postNewLink } from "../../domain/mutation";
import Link from "next/link";

interface NewPostFormState {
    url: string,
    description: string,
    success: boolean | undefined,
}

// todo: move to components
class NewPostForm extends React.Component<any, NewPostFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            url: '',
            description: '',
            success: undefined,
        };

        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUrlChange(event: any) {
        this.setState({ url: event.target.value });
    }

    handleDescriptionChange(event: any) {
        this.setState({ description: event.target.value });
    }

    handleSubmit(event: any) {
        event.preventDefault();
        console.log(this.state);

        postNewLink(this.state.url, this.state.description)
            .then(data => {
                console.log(data);
                this.setState({ success: true });
            })
            .catch(err => {
                console.log(err);
                this.setState({ success: false });
            });
    }

    render() {
        return (
            <form className={styles.form} onSubmit={this.handleSubmit}>
                Create new post
                <Input type='text' name='url' placeholder='url'
                       value={this.state.url}
                       onChange={(event) => this.handleUrlChange(event)}/>
                <Input type='text' name='description' placeholder='description'
                       value={this.state.description}
                       onChange={(event) => this.handleDescriptionChange(event)}/>
                {
                    typeof this.state.success === 'undefined' ?
                        <button type='submit'>create post</button> :
                        this.state.success ?
                            <>
                                You have successfully created new post!
                                <Link href='/feed'>Go to feed</Link>
                            </> :
                            <>
                                Something went wrong!
                            </>
                }
            </form>
        );
    }
}

const NewPost: NextPage = () => {
    return (
        <NewPostForm/>
    );
};

export default NewPost;
