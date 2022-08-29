import React from "react";
import type { NextPage } from 'next';

import { signIn } from "../../domain/mutation";

interface SignInFormState {
    email: string,
    password: string,
}

// todo: move to components maybe
class SignInForm extends React.Component<any, SignInFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event: any) {
        this.setState({ email: event.target.value });
    }

    handlePasswordChange(event: any) {
        this.setState({ password: event.target.value });
    }

    handleSubmit(event: any) {
        event.preventDefault();
        console.log(this.state);

        signIn(this.state.email, this.state.password)
            .then(data => console.log(data));
    }

    render() {
        return (
            <form style={{
                display: 'flex',
                flexDirection: 'column',
                width: 200,
            }} onSubmit={this.handleSubmit}>
                Sign in
                <input type='text' name='email' placeholder='email'
                       value={this.state.email}
                       onChange={(event) => this.handleEmailChange(event)}/>
                <input type='password' name='password' placeholder='password'
                       value={this.state.password}
                       onChange={(event) => this.handlePasswordChange(event)}/>
                <button type='submit'>sign in</button>
            </form>
        );
    }
}

const SignIn: NextPage = () => {
    return (
        <SignInForm/>
    );
};

export default SignIn;
