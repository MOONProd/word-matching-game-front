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
        } else {
            handleUserLeave();
        }
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
        console.log("Websocket subscribe!");
    
        // 사용자 입장 시 'JOIN' 메시지를 보냄
        let chatMessage = {
            senderName: username,
            status: 'JOIN'
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

    // WebSocket 연결 해제 함수
    const handleUserLeave = () => {
        console.log('User leaving');
        if (stompClient && stompClient.connected) {
            let chatMessage = {
                senderName: user.username,
                status: 'LEAVE',
            };
            stompClient.send(`/app/message`, {}, JSON.stringify(chatMessage));
            stompClient.disconnect(() => console.log('Disconnected from WebSocket'));
            setConnected(false); // 연결 상태를 false로 설정
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
