// src/recoil/presenceAtom.js
import { atom } from 'recoil';

export const userPresenceAtom = atom({
    key: 'userPresence', // unique ID (with respect to other atoms/selectors)
    default: true, // default value (the user is assumed present initially)
});