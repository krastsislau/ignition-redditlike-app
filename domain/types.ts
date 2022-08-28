export type AuthPayload = {
    token: string,
    user: User,
};

export type Feed = {
    count: number,
    links: Array<Link>,
};

export type Link = {
    id: number,
    description: string,
    postedBy: User,
    url: string,
    votes: Array<Vote>,
};

export type User = {
    id: number,
    email: string,
    name: string,
    links: Array<Link>,

};

export type Vote = {
    id: number,
    link: Link,
    user: User,
};
