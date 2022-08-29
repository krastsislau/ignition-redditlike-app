import React from "react";
import type { NextPage } from 'next';

import { signIn } from "../../domain/mutation";
import { storage } from "../../storage";
import { Input } from 'antd';
import styles from "../../styles/Form.module.css";
import Link from "next/link";

interface SignInFormState {
    email: string,
    password: string,
    success: boolean | undefined,
    isSignedIn: boolean,
}

// todo: move to components
class SignInForm extends React.Component<any, SignInFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            success: undefined,
            isSignedIn: false,
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
            .then(data => {
                console.log(data);
                storage.setToken(data.token);
                storage.setUser(data.user);
                this.setState({ success: true });
            })
            .catch(err => {
                console.log(err);
                this.setState({ success: false });
            })
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
                            You are already signed in
                            <button onClick={(event: any) => {
                                event.preventDefault();
                                storage.clearUser();
                                storage.clearToken();
                                this.setState({ isSignedIn: false });
                            }}>Sign out</button>
                        </>
                        :
                        <>
                            Sign in
                            <Input type='text' name='email' placeholder='email'
                                   value={this.state.email}
                                   onChange={(event) => this.handleEmailChange(event)}/>
                            <Input type='password' name='password' placeholder='password'
                                   value={this.state.password}
                                   onChange={(event) => this.handlePasswordChange(event)}/>
                            {
                                typeof this.state.success === 'undefined' ?
                                    <button type='submit'>sign in</button> :
                                    this.state.success ?
                                        <>
                                            You have successfully signed in!
                                            <Link href='/feed'>Go to feed</Link>
                                        </> :
                                        <>
                                            Something went wrong!
                                        </>
                            }
                        </>
                }
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
