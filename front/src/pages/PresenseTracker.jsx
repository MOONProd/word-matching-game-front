// src/components/PresenceTracker.jsx
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import { userPresenceAtom } from '../recoil/userPresenseAtom'; // Importing the correct atom

const PresenceTracker = ({ children, stompClient }) => {
    const [userPresence, setUserPresence] = useRecoilState(userPresenceAtom); // Get roomId and presence state from Recoil
    const { roomId } = userPresence; // Extract roomId from the atom
    const location = useLocation();
    const currentPath = location.pathname; // Track the current path

    useEffect(() => {
        // Check if user is on a /wait/:roomId route
        if (currentPath.startsWith('/wait')) {
            setUserPresence((prev) => ({ ...prev, isUserPresent: true })); // User is on /wait route
        } else {
            // User has left the /wait route, disconnect the WebSocket if available
            if (stompClient && stompClient.connected && roomId) {
                stompClient.disconnect(() => {
                    console.log(`WebSocket disconnected for room ${roomId} as user left the /wait route.`);
                });
            }
            setUserPresence((prev) => ({ ...prev, isUserPresent: false })); // Mark user as not present
        }
    }, [currentPath, roomId, stompClient, setUserPresence]); // Effect runs on path change

    return <>{children}</>;
};

export default PresenceTracker;
