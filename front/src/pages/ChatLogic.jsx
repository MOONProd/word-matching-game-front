import React, { createContext, useContext, useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';

let stompClient = null;

const ChatContext = createContext(undefined);

export const ChatLogicProvider = ({ children }) => {
    const user = useRecoilValue(userAtom);
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (user && user.username && user.userInformation && user.userInformation.id) {
            connectWebSocket(user.username, user.userInformation.id);
        } else {
            handleUserLeave();
        }

        // Cleanup on component unmount
        return () => {
            handleUserLeave();
        };
    }, [user]);

    const connectWebSocket = (username, userId) => {
        let Sock = new SockJS('/ws');
        stompClient = over(Sock);

        console.log("User data from atom: ", user);

        // Adjust the headers to match the structure of your user data
        const headers = {
            userId: userId.toString(),
            username: username
        };

        stompClient.connect(headers, () => onConnected(username, userId), onError);
    };

    const onConnected = (username, userId) => {
        setConnected(true);
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        console.log("Websocket subscribed to /chatroom/public");

        let chatMessage = {
            senderName: username,
            status: 'JOIN',
            userId: userId
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };
    

    const onMessageReceived = (payload) => {
        try {
            let payloadData = JSON.parse(payload.body);
            console.log('Received message:', payloadData);
    
            // 메시지의 상태를 체크하여 출력 메시지 설정
            if (payloadData.status === 'JOIN') {
                payloadData.message = `${payloadData.senderName}님이 들어왔습니다.`; // JOIN 상태일 때 출력 메시지 설정
            } else if (payloadData.status === 'LEAVE') {
                payloadData.message = `${payloadData.senderName}님이 나갔습니다.`; // LEAVE 상태일 때 출력 메시지 설정
            }
    
            console.log('Received message:', payloadData);
            setMessages((prevMessages) => [...prevMessages, payloadData]);
        } catch (error) {
            console.error("Message Parsing Error: ", error, payload.body);
        }
    };
    const sendMessage = (messageContent) => {
        if (stompClient && user && user.userInformation && user.userInformation.id) {
            let chatMessage = {
                senderName: user.username,
                message: messageContent,
                status: 'MESSAGE',
                userId: user.userInformation.id
            };
            stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
        }
    };

    const handleUserLeave = () => {
        console.log('User leaving');
        if (stompClient && stompClient.connected) {
            let chatMessage = {
                senderName: user.username,
                status: 'LEAVE',
                userId: user.userInformation?.id // Using optional chaining to avoid errors
            };
            stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
            stompClient.disconnect(() => console.log('Disconnected from WebSocket'));
            setConnected(false);
        }
    };

    const onError = (error) => {
        console.error('WebSocket Error:', error);
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage, connected }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};
