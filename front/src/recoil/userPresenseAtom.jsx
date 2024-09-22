// src/recoil/userPresenceAtom.jsx
import { atom } from 'recoil';

export const userPresenceAtom = atom({
    key: 'userPresenceAtom',
    default: {
        isUserPresent: true,
        roomId: null, // Add roomId to track the room the user is in
    },
});
