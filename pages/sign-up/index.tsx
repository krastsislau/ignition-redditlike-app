import React from "react";
import type { NextPage } from 'next';

import { signUp } from "../../domain/mutation";

interface SignUpFormState {
    email: string,
    name: string,
    password: string,
}

// todo: move to components maybe
class SignUpForm extends React.Component<any, SignUpFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event: any) {
        this.setState({ email: event.target.value });
    }

    handleNameChange(event: any) {
        this.setState({ name: event.target.value });
    }

    handlePasswordChange(event: any) {
        this.setState({ password: event.target.value });
    }

    handleSubmit(event: any) {
        event.preventDefault();
        console.log(this.state);

        signUp(this.state.email, this.state.password, this.state.name)
            .then(data => console.log(data));
    }

    render() {
        return (
            <form style={{
                display: 'flex',
                flexDirection: 'column',
                width: 200,
            }} onSubmit={this.handleSubmit}>
                Sign up
                <input type='text' name='email' placeholder='email'
                       value={this.state.email}
                       onChange={(event) => this.handleEmailChange(event)}/>
                <input type='text' name='name' placeholder='name'
                       value={this.state.name}
                       onChange={(event) => this.handleNameChange(event)}/>
                <input type='password' name='password' placeholder='password'
                       value={this.state.password}
                       onChange={(event) => this.handlePasswordChange(event)}/>
                <button type='submit'>sign up</button>
            </form>
        );
    }
}

const SignUp: NextPage = () => {
    return (
        <SignUpForm/>
    );
};

export default SignUp;
