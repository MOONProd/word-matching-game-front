// src/pages/WaitingPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from "react-router-dom";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import ChatModal from './ChatModal'; // Import ChatModal
import { useChat } from './ChatLogic';

export const WaitingPage = () => {
    const user = useRecoilValue(userAtom);
    const { roomId } = useParams();
    // const navigate = useNavigate();

    const { messages: chatMessages, sendMessage: sendChatMessage, connectedUsers } = useChat(); // 전체 채팅 관련 useChat 훅 사용

    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [chatContent, setChatContent] = useState(''); // For global chat
    const [isReady, setIsReady] = useState(false); // Local user's readiness
    const [otherUserIsReady, setOtherUserIsReady] = useState(false); // Other user's readiness
    const stompClientRef = useRef(null);
    const roomIdRef = useRef(roomId);
    const chatEndRef = useRef(null); // 전체 채팅 스크롤을 위한 ref 추가
    const roomChatEndRef = useRef(null); // 방 채팅 스크롤을 위한 ref 추가

    // State for ChatModal
    // const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    useEffect(() => {
        roomIdRef.current = roomId;
    }, [roomId]);

    useEffect(() => {
        if (user && user.username && roomId && !stompClientRef.current && user.userInformation.id != null) {
            connectWebSocket(user.username, user.userInformation.id, roomId);
            console.log("WebSocket connection initiated.");
            updateEnteredPlayerId(user.userInformation.id, roomId); // Update room status on enter
            console.log("hahahahahahahahahah: ", user.userInformation.id);
        }
        console.log("this is entered id" + user.userInformation.id);
    }, [user, roomId]);

    useEffect(() => {
        // Handle component unmount
        return () => {
            handleUserLeave(roomIdRef.current);
        };
    }, []);

    useEffect(() => {
        // Handle browser refresh or closing the tab
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            handleUserLeave(roomIdRef.current);
            e.returnValue = ''; // For Chrome to show alert
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


    useEffect(() => {
        // 전체 채팅 메시지가 업데이트될 때마다 스크롤을 최신 메시지로 이동
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    useEffect(() => {
        // 방 채팅 메시지가 업데이트될 때마다 스크롤을 최신 메시지로 이동
        if (roomChatEndRef.current) {
            roomChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const connectWebSocket = (username, userId, roomId) => {
        let Sock = new SockJS('/ws');
        const client = over(Sock);
        stompClientRef.current = client; // Assign client to ref

        const headers = {
            username: username,
            roomId: roomId,
        };

        client.connect(headers, () => onConnected(username, userId, roomId), onError);
    };

    const onConnected = (username, userId, roomId) => {
        setConnected(true);

        // Subscribe to private room
        stompClientRef.current.subscribe(`/room/${roomId}/public`, onMessageReceived);

        // Send JOIN message to the room
        let joinMessage = {
            senderName: username,
            status: 'JOIN',
            userId: userId,
        };
        stompClientRef.current.send(`/app/room/${roomId}/message`, {}, JSON.stringify(joinMessage));
    };

    const onMessageReceived = (payload) => {
        try {
            let payloadData = JSON.parse(payload.body);
            console.log('Received message:', payloadData);

            if (payloadData.status === 'USER_LIST') {
                // Ensure uniqueness of connected users
                const uniqueUsers = Array.from(new Set(payloadData.userList));
                setConnectedUsers(uniqueUsers);
            } else if (payloadData.status === 'READY' || payloadData.status === 'NOT_READY') {
                const senderUserId = payloadData.userId;
                const isSenderReady = payloadData.status === 'READY';

                if (senderUserId !== user.userInformation.id) {
                    // Message is from the other user
                    setOtherUserIsReady(isSenderReady);
                } else {
                    // Message is from the local user, already handled in handleReadyClick
                }
            } else if (payloadData.status === 'JOIN') {
                // User joined
                setMessages((prevMessages) => [...prevMessages, payloadData]);
            } else if (payloadData.status === 'LEAVE') {
                // User left
                setMessages((prevMessages) => [...prevMessages, payloadData]);
                // Reset other user's readiness
                setOtherUserIsReady(false);

                // If the other user left, reset local user's readiness
                if (payloadData.senderName !== user.username) {
                    setIsReady(false); // Reset local user's readiness
                    // Update the server about the readiness status
                    updateReadyStatusOnServer(false);
                }
            } else {
                // Handle other message types
                setMessages((prevMessages) => [...prevMessages, payloadData]);
            }
        } catch (error) {
            console.error('Message Parsing Error: ', error, payload.body);
        }
    };

    const sendMessage = () => {
        if (stompClientRef.current && connected) {
            let chatMessage = {
                senderName: user.username,
                message: messageContent,
                status: 'MESSAGE',
                userId: user.userInformation.id,
            };
            stompClientRef.current.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
            setMessageContent('');
        }
    };

    const handleMessageChange = (event) => {
        setMessageContent(event.target.value);
    };

    const handleChatContentChange = (event) => {
        setChatContent(event.target.value);
    };

    const handleUserLeave = (roomId) => {
        console.log('User leaving room:', roomId);

        // Update room status on leave
        updateEnteredPlayerId(0, roomId);

        // Reset local readiness and update server
        setIsReady(false);
        updateReadyStatusOnServer(false);

        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.disconnect(() => console.log('Disconnected from WebSocket'));
            stompClientRef.current = null; // Reset the client ref
            setConnected(false);
        }
    };

    const onError = (error) => {
        console.error('WebSocket Error:', error);
    };

    // Function to update enteredPlayerId
    const updateEnteredPlayerId = async (enteredPlayerId, roomId) => {
        try {
            console.log("Updating enteredPlayerId to:", enteredPlayerId);
            // Send GET request to the server using Fetch
            const response = await fetch(`/api/room/${roomId}/enter?enteredPlayerId=${enteredPlayerId}`);

            if (response.ok) {
                const data = await response.text();
                console.log('Room status updated successfully:', data);
            } else {
                console.error('Error updating room status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating room status:', error);
        }
    };

    // Function to update readiness status on the server
    const updateReadyStatusOnServer = async (readyStatus) => {
        try {
            const hostId = parseInt(roomId); // Assuming roomId is the hostId
            const userId = user.userInformation.id;

            console.log('Updating ready status on server for userId:', userId);

            const requestBody = {
                userId: userId,
                forceReadyStatus: readyStatus,
            };

            const response = await fetch(`/api/room/${hostId}/ready`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.text();
                console.log('Host readiness status updated successfully:', data);
                // Notify other users about the readiness status
                let readyMessage = {
                    senderName: user.username,
                    status: readyStatus ? 'READY' : 'NOT_READY',
                    userId: userId,
                };
                stompClientRef.current.send(`/app/room/${roomId}/message`, {}, JSON.stringify(readyMessage));
            } else {
                console.error('Error updating host readiness status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating host readiness status:', error);
        }
    };

    // Function to handle Ready button click
    const handleReadyClick = async () => {
        try {
            const newReadyStatus = !isReady;
            setIsReady(newReadyStatus);

            const hostId = parseInt(roomId); // Assuming roomId is the hostId
            const userId = user.userInformation.id;

            console.log('Handle ready click for userId:', userId);

            const requestBody = {
                userId: userId,
            };

            const response = await fetch(`/api/room/${hostId}/ready`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.text();
                console.log('Ready status updated successfully:', data);
                // Notify other users about ready status
                let readyMessage = {
                    senderName: user.username,
                    status: newReadyStatus ? 'READY' : 'NOT_READY',
                    userId: userId,
                };
                stompClientRef.current.send(`/app/room/${roomId}/message`, {}, JSON.stringify(readyMessage));
            } else {
                console.error('Error updating ready status:', response.statusText);
            }

            // The button disabling is handled based on the number of connected users
            // Remove the bothUsersReady logic if not needed
        } catch (error) {
            console.error('Error updating ready status:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Header Area */}
            <div className="flex justify-between items-center p-4 bg-blue-200 shadow" 
                 style={{ fontFamily: 'MyCustomFont, sans-serif', height: '10%' }}
            >
                <h2 className="text-xl font-bold">플레이어 준비 상태</h2>
                <div className="flex space-x-4">
                <span className="text-black">
                    You 
                    <span className={isReady ? 'text-green-700 ml-1 font-bold' : 'text-red-500 ml-1 font-bold'}>
                        {isReady ? '준비 완료' : '준비 대기'}
                    </span>
                </span>
                <span className="text-black">
                    Other 
                    <span className={otherUserIsReady ? 'text-green-700 ml-1 font-bold' : 'text-red-500 ml-1 font-bold'}>
                        {otherUserIsReady ? '준비 완료' : '준비 대기'}
                    </span>
                </span>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex flex-grow overflow-hidden bg-blue-50 shadow">
                {/* Left Side: Connected Users & Global Chat */}
                <div className="w-1/4 bg-white p-4 border-r border-gray-200 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-4"
                            style={{ fontFamily: 'MyCustomFont, sans-serif' }}>접속자 목록</h3>
                        <ul>
                            {connectedUsers.map((username, index) => (
                                <li key={index} className="mb-2">{username}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4"
                            style={{ fontFamily: 'MyCustomFont, sans-serif' }}>전체 채팅</h3>
                        <div className="overflow-y-auto max-h-40 mb-4">
                            <ul className="list-none p-0">
                                {chatMessages.map((item, index) => (
                                    <li key={index} className="mb-2">
                                        {item.status === 'JOIN' || item.status === 'LEAVE' ? (
                                            <strong>{`${item.senderName}님이 ${item.status === 'JOIN' ? '들어왔습니다.' : '나갔습니다.'}`}</strong>
                                        ) : (
                                            <>
                                                <strong>{item.senderName}:</strong> {item.message}
                                            </>
                                        ) }
                                    </li>
                                ))}
                                <div ref={chatEndRef} /> {/* 자동 스크롤을 위한 Ref */}
                            </ul>
                        </div>
                        <div className="flex">
                            <TextField
                                id="outlined-chat"
                                label="메시지를 입력하세요"
                                variant="outlined"
                                value={chatContent}
                                onChange={handleChatContentChange}
                                className="flex-grow"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                        e.preventDefault();
                                        sendChatMessage(chatContent);
                                        setChatContent('');
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    sendChatMessage(chatContent);
                                    setChatContent('');
                                }}
                            >
                                전송
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Room-specific chat */}
                <div className="flex flex-col flex-grow overflow-hidden p-5">
                    <div className="flex-grow overflow-y-auto mb-2">
                        <ul className="list-none p-0">
                            {messages.map((item, index) => (
                                <li
                                    key={index}
                                    className={`flex ${
                                        item.senderName === user.username ? 'justify-end' : 'justify-start'
                                    } mb-2`}
                                >
                                    <div
                                        className={`px-4 py-2 rounded-xl ${
                                            item.senderName === user.username ? 'bg-green-100' : 'bg-gray-200'
                                        } max-w-lg break-words`}
                                    >
                                        {item.status === 'JOIN' || item.status === 'LEAVE' ? (
                                            <strong>{`${item.senderName}님이 ${
                                                item.status === 'JOIN' ? '들어왔습니다.' : '나갔습니다.'
                                            }`}</strong>
                                        ) : (
                                            <>
                                                <strong>{item.senderName === user.username ? '나' : item.senderName}:</strong>{' '}
                                                {item.message}
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                            <div ref={roomChatEndRef} /> {/* 자동 스크롤을 위한 Ref */}
                        </ul>
                    </div>
                    <div className="flex items-center">
                        <TextField
                            id="outlined-basic"
                            label={isReady && otherUserIsReady ? "메시지를 입력하세요" : "채팅은 준비 완료 후 가능합니다."}
                            variant="outlined"
                            value={messageContent}
                            onChange={handleMessageChange}
                            className="flex-grow mx-4"
                            disabled={!isReady || !otherUserIsReady}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={sendMessage}
                            disabled={!isReady || !otherUserIsReady}
                        >
                            전송
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer Area */}
            <div className="flex justify-center items-center p-4 bg-gray-100 border-t" style={{ height: '10%' }}>
                <Button
                    variant="contained"
                    color={isReady ? 'secondary' : 'primary'}
                    onClick={handleReadyClick}
                    disabled={connectedUsers.length < 2}
                >
                    {isReady ? '준비 취소' : '준비'}
                </Button>
            </div>
        </div>
    );
};
