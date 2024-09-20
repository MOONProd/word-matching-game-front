import { atom } from 'recoil';

export const userAtom = atom({
    key: 'userAtom',
    default: null, // Initially, user info is null until it's fetched
});