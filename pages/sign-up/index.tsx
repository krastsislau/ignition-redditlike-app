import React from "react";
import type { NextPage } from 'next';

import { signUp } from "../../domain/mutation";
import { Input } from 'antd';
import styles from "../../styles/Form.module.css";
import Link from "next/link";

interface SignUpFormState {
    email: string,
    name: string,
    password: string,
    success: boolean | undefined,
}

// todo: move to components
class SignUpForm extends React.Component<any, SignUpFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
            success: undefined,
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
                <Link href='/'>Go back to main page</Link>
                Sign up
                <Input type='text' name='email' placeholder='email'
                       value={this.state.email}
                       onChange={(event) => this.handleEmailChange(event)}/>
                <Input type='text' name='name' placeholder='name'
                       value={this.state.name}
                       onChange={(event) => this.handleNameChange(event)}/>
                <Input type='password' name='password' placeholder='password'
                       value={this.state.password}
                       onChange={(event) => this.handlePasswordChange(event)}/>
                {
                    typeof this.state.success === 'undefined' ?
                        <button type='submit'>sign up</button> :
                        this.state.success ?
                            <>
                                You have successfully signed up!
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

const SignUp: NextPage = () => {
    return (
        <SignUpForm/>
    );
};

export default SignUp;
