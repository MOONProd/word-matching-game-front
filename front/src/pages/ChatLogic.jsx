import React, { createContext, useContext, useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';

let stompClient = null;

// Create a context for the chat
const ChatContext = createContext();

// ChatLogic Provider Component
export const ChatLogicProvider = ({ children }) => {
    const user = useRecoilValue(userAtom); // Recoil 상태에서 유저 정보 가져오기
    const [messages, setMessages] = useState([]); // 전체 채팅 메시지 목록
    const [connected, setConnected] = useState(false); // 연결 상태

    useEffect(() => {
        if (user && user.username) {
            connectWebSocket(user.username);
        }
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [user]);

    // WebSocket 연결 함수
    const connectWebSocket = (username) => {
        let Sock = new SockJS('/ws');
        stompClient = over(Sock);
        stompClient.connect({}, () => onConnected(username), onError);
    };

    const onConnected = (username) => {
        
        setConnected(true);
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        
        let chatMessage = {
            senderName: username,
            status: 'JOIN'
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };

    const onMessageReceived = (payload) => {
        try {
            let payloadData = JSON.parse(payload.body);
            console.log('Received message:', payloadData); // 수신된 메시지 로그
            setMessages((prevMessages) => [...prevMessages, payloadData]);
        } catch (error) {
            console.error("Message Parsing Error: ", error, payload.body);
        }
    };

    const sendMessage = (message) => {
        if (stompClient && user) {
            let chatMessage = {
                senderName: user.username,
                message: message,
                status: 'MESSAGE'
            };
            stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
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

// Hook to use the Chat context
export const useChat = () => {
    return useContext(ChatContext);
};
