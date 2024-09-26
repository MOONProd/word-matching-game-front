// src/components/ChatLogic.js

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';

const ChatContext = createContext(undefined);

export const ChatLogicProvider = ({ children }) => {
    const user = useRecoilValue(userAtom);

    const [messages, setMessages] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const stompClientRef = useRef(null); // Use useRef instead of useState

    useEffect(() => {
        if (user && user.username && user.userInformation && user.userInformation.id) {
            connectWebSocket(user.username, user.userInformation.id);
        }

        // Cleanup on component unmount
        return () => {
            handleUserLeave();
        };
    }, [user]);

    useEffect(() => {
        // Handle browser refresh or closing the tab
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            handleUserLeave();
            e.returnValue = ''; // For Chrome to show alert
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const connectWebSocket = (username, userId) => {
        let Sock = new SockJS('/ws');
        const client = over(Sock);
        stompClientRef.current = client; // Assign client to ref

        const headers = {
            username: username,
        };

        client.connect(headers, () => onConnected(username, userId), onError);
    };

    const onConnected = (username, userId) => {
        setConnected(true);

        // Use the stompClientRef.current instead of stompClient
        stompClientRef.current.subscribe('/chatroom/public', onMessageReceived);

        let chatMessage = {
            senderName: username,
            status: 'JOIN',
            userId: userId,
        };
        stompClientRef.current.send('/app/message', {}, JSON.stringify(chatMessage));
    };

    const onMessageReceived = (payload) => {
        try {
            let payloadData = JSON.parse(payload.body);
            console.log('Received message:', payloadData);

            if (payloadData.status === 'USER_LIST') {
                // Update the list of connected users
                setConnectedUsers(Array.from(payloadData.userList));
            } else {
                // Handle other message types
                setMessages((prevMessages) => [...prevMessages, payloadData]);
            }
        } catch (error) {
            console.error('Message Parsing Error: ', error, payload.body);
        }
    };

    const sendMessage = (messageContent) => {
        if (stompClientRef.current && user && user.userInformation && user.userInformation.id) {
            let chatMessage = {
                senderName: user.username,
                message: messageContent,
                status: 'MESSAGE',
                userId: user.userInformation.id,
            };
            stompClientRef.current.send('/app/message', {}, JSON.stringify(chatMessage));
        }
    };

    const handleUserLeave = () => {
        console.log('User leaving');
        if (stompClientRef.current && stompClientRef.current.connected) {
            let chatMessage = {
                senderName: user.username,
                status: 'LEAVE',
                userId: user.userInformation?.id,
            };
            stompClientRef.current.send('/app/message', {}, JSON.stringify(chatMessage));
            stompClientRef.current.disconnect(() => console.log('Disconnected from WebSocket'));
            setConnected(false);
        }
    };

    const onError = (error) => {
        console.error('WebSocket Error:', error);
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage, connected, connectedUsers }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};
