import React from "react";
import type { NextPage } from 'next';
import Link from "next/link";
import { Input } from 'antd';
import styles from "../../styles/Form.module.css";

import { postNewLink } from "../../api/mutation";
import { storage } from "../../storage";


interface NewPostFormState {
    isSignedIn: boolean,
    url: string,
    description: string,
    success: boolean | undefined,
}

// todo: move to components
class NewPostForm extends React.Component<any, NewPostFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isSignedIn: false,
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

    componentDidMount() {
        const user = storage.getUser();
        if (user) {
            this.setState({ isSignedIn: true });
        }
    }

    render() {
        return (
            <form className={styles.form} onSubmit={this.handleSubmit}>
                <Link href='/'>Go back to main page</Link>
                {
                    this.state.isSignedIn ?
                        <>
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
                        </>
                        :
                        <>
                            You need to be signed in to create a post
                            <Link href='/sign-in'>Go to sign in page</Link>
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
