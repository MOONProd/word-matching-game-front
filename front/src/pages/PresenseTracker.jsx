// src/components/PresenceTracker.jsx
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import { userPresenceAtom } from '../recoil/userPresenseAtom';

let stompClient = null; // Assume this is set when you connect to the WebSocket

const PresenceTracker = ({ children }) => {
    const [isUserPresent, setIsUserPresent] = useRecoilState(userPresenceAtom);
    const location = useLocation();
    console.log(location);

    useEffect(() => {
        // User is navigating to a new page, disconnect WebSocket
        if (stompClient && stompClient.connected) {
            stompClient.over().disconnect(() => {
                console.log("WebSocket disconnected due to page change.");
            });
        }
        setIsUserPresent(false); // Mark the user as not present

        return () => {
            // Optionally handle any cleanup if necessary
        };
    }, [location, setIsUserPresent]); // Effect will run on location change

    return <>{children}</>;
};

export default PresenceTracker;
