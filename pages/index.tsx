import type {NextPage} from 'next';
import Head from 'next/head';
import Link from "next/link";

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Redditlike App | Home</title>
                <meta name="description" content="The main page"/>
                <link href='https://fonts.googleapis.com/css?family=IBM Plex Mono' rel='stylesheet'/>
            </Head>
            <main style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20
            }}>
                <h1>
                    Welcome to the Redditlike app
                </h1>
                <Link href='/feed'>Got to feed</Link>
                <Link href='/sign-in'>Sign in</Link>
                <Link href='/sign-up'>Sign up</Link>
                <Link href='/new-post'>Create a post</Link>
                bottom text
            </main>
        </div>
    )
}

export default Home
