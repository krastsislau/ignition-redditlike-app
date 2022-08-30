import { User } from "./api/types";

const storagePrefix = 'rasteeslove_ignition_';

const storage = {
    getToken: (): string | null => {
        return window.localStorage.getItem(`${storagePrefix}token`);
    },
    setToken: (token: string) => {
        window.localStorage.setItem(`${storagePrefix}token`, token);
    },
    clearToken: () => {
        window.localStorage.removeItem(`${storagePrefix}token`);
    },
    getUser: (): User | null => {
        const userStr = window.localStorage.getItem(`${storagePrefix}user`);
        if (!userStr) {
            return null;
        } else {
            return JSON.parse(userStr);
        }
    },
    setUser: (user: User) => {
        window.localStorage.setItem(`${storagePrefix}user`, JSON.stringify(user));
    },
    clearUser: () => {
        window.localStorage.removeItem(`${storagePrefix}user`);
    },
};

export { storage };
