// src/components/PublicSocketConnection.js

import React, { useEffect, useRef, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';

const PublicSocketConnection = () => {
    const user = useRecoilValue(userAtom);
    const [connected, setConnected] = useState(false);
    const stompClientRef = useRef(null); // Ref to hold the WebSocket client

    useEffect(() => {
        if (user && user.username && user.userInformation && user.userInformation.id) {
            // Check if the user is defined and the username exists
            if (!stompClientRef.current || !stompClientRef.current.connected) {
                connectWebSocket(user.username, user.userInformation.id); // Connect if not connected
            }
        } else {
            console.log("User not logged in or no username available.");
        }

        // Cleanup on unmount
        return () => {
            disconnectWebSocket();
        };
    }, [user]);

    const connectWebSocket = (username, userId) => {
        let Sock = new SockJS('/ws');  // WebSocket endpoint
        const client = over(Sock);
        stompClientRef.current = client; // Store the WebSocket client

        const headers = { username };

        client.connect(headers, () => onConnected(username, userId), onError);
    };

    const onConnected = (username, userId) => {
        setConnected(true);
        console.log('Connected to WebSocket as:', username);

        stompClientRef.current.subscribe('/chatroom/public', (payload) => {
            console.log('Public message received:', JSON.parse(payload.body));
        });

        let joinMessage = {
            senderName: username,
            status: 'JOIN',
            userId: userId,
        };
        stompClientRef.current.send('/app/message', {}, JSON.stringify(joinMessage));
    };

    const disconnectWebSocket = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            let leaveMessage = {
                senderName: user?.username,
                status: 'LEAVE',
                userId: user?.userInformation?.id,
            };
            stompClientRef.current.send('/app/message', {}, JSON.stringify(leaveMessage));

            stompClientRef.current.disconnect(() => {
                console.log('Disconnected from WebSocket');
            });
            stompClientRef.current = null; // Reset client reference
            setConnected(false);
        }
    };

    const onError = (error) => {
        console.error('WebSocket Error:', error);
    };

    return (
        <div>
            {connected ? <p>Connected to public chat!</p> : <p>Checking connection...</p>}
        </div>
    );
};

export default PublicSocketConnection;
