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

export const WaitingPage = () => {
    const user = useRecoilValue(userAtom);
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [isReady, setIsReady] = useState(false); // Local user's readiness
    const [otherUserIsReady, setOtherUserIsReady] = useState(false); // Other user's readiness
    const stompClientRef = useRef(null);
    const roomIdRef = useRef(roomId);

    // State for ChatModal
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

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
        <div className="flex flex-col h-screen bg-blue-50">
            {/* Display Connected Users */}
            <div className="p-4">
                <h3 className="text-lg font-bold">접속자 목록</h3>
                <ul>
                    {connectedUsers.map((username, index) => (
                        <li key={index}>{username}</li>
                    ))}
                </ul>
            </div>

            {/* Display Readiness Statuses */}
            <div className="p-4">
                <h3 className="text-lg font-bold">플레이어 준비 상태</h3>
                <ul>
                    <li>{`당신은 ${isReady ? '준비 완료' : '준비 안됨'}`}</li>
                    <li>{`상대방은 ${otherUserIsReady ? '준비 완료' : '준비 안됨'}`}</li>
                </ul>
            </div>

            {/* Room-Specific Chat Messages */}
            <div className="flex-grow p-5 overflow-y-auto w-1/2 mx-auto">
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
                </ul>
            </div>

            {/* Chat input and buttons */}
            <div className="flex justify-center p-4 space-x-2">
                <TextField
                    id="outlined-basic"
                    label="메시지를 입력하세요"
                    variant="outlined"
                    value={messageContent}
                    onChange={handleMessageChange}
                    className="mr-4"
                    disabled={!isReady || !otherUserIsReady} // Disable until both are ready
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={sendMessage}
                    disabled={!isReady || !otherUserIsReady} // Disable until both are ready
                >
                    전송
                </Button>
                <Button
                    variant="contained"
                    color={isReady ? 'secondary' : 'primary'}
                    onClick={handleReadyClick}
                    disabled={connectedUsers.length < 2} // Disable the button when only one user is in the room
                >
                    {isReady ? '준비 취소' : '준비'}
                </Button>
                {/* Button to open the main chat modal */}
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => setIsChatModalOpen(true)}
                >
                    전체채팅 열기
                </Button>
            </div>

            {/* Warning Message */}
            {(!isReady || !otherUserIsReady) && (
                <p className="text-red-500 text-center mt-2">
                    채팅을 사용하려면 두 플레이어가 모두 준비되어야 합니다.
                </p>
            )}

            {/* ChatModal Component */}
            <ChatModal
                isOpen={isChatModalOpen}
                onClose={() => setIsChatModalOpen(false)}
            />
        </div>
    );
};
