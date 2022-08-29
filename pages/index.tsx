import type {NextPage} from 'next';
import Head from 'next/head';
import Link from "next/link";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>followeddit</title>
                <meta name="description" content="The Reddit-like app"/>
                <link href='https://fonts.googleapis.com/css?family=IBM Plex Mono' rel='stylesheet'/>
            </Head>
            <main style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20
            }}>
                <h1>
                    Welcome to followeddit
                </h1>
                <Link href='/feed'>Go to feed</Link>
                <Link href='/sign-in'>Sign in</Link>
                <Link href='/sign-up'>Sign up</Link>
                <Link href='/new-post'>Create a post</Link>
            </main>
        </div>
    )
}

export default Home
