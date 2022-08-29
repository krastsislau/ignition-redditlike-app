import React from "react";
import type { NextPage } from 'next';

import { postNewLink } from "../../domain/mutation";

interface NewPostFormState {
    url: string,
    description: string,
}

// todo: move to components maybe
class NewPostForm extends React.Component<any, NewPostFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            url: '',
            description: '',
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
            .then(data => console.log(data));
    }

    render() {
        return (
            <form style={{
                display: 'flex',
                flexDirection: 'column',
                width: 200,
            }} onSubmit={this.handleSubmit}>
                Create new post
                <input type='text' name='url' placeholder='url'
                       value={this.state.url}
                       onChange={(event) => this.handleUrlChange(event)}/>
                <input type='text' name='description' placeholder='description'
                       value={this.state.description}
                       onChange={(event) => this.handleDescriptionChange(event)}/>
                <button type='submit'>create new post</button>
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
