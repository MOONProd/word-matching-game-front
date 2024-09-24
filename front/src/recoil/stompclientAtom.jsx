// src/recoil/stompClientAtom.jsx
import { atom } from 'recoil';

export const stompClientAtom = atom({
    key: 'stompClientAtom',
    default: null, // Default value is null, meaning no WebSocket connection initially
});
