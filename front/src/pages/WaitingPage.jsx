import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from "react-router-dom";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

export const WaitingPage = () => {
    const user = useRecoilValue(userAtom);
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [isReady, setIsReady] = useState(false);
    const stompClientRef = useRef(null);

    useEffect(() => {
        if (user && user.username && roomId) {
            connectWebSocket(user.username, user.userInformation.id, roomId);
            updateEnteredPlayerId(user.userInformation.id, roomId); // Update room status on enter
        }

        // Cleanup on component unmount
        return () => {
            handleUserLeave(roomId);
        };
    }, [user, roomId]);

    useEffect(() => {
        // Handle browser refresh or closing the tab
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            handleUserLeave(roomId);
            e.returnValue = ''; // For Chrome to show alert
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [roomId]);

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
        let chatMessage = {
            senderName: username,
            status: 'JOIN',
            userId: userId,
        };
        stompClientRef.current.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
    };

    const onMessageReceived = (payload) => {
        try {
            let payloadData = JSON.parse(payload.body);
            console.log('Received message:', payloadData);

            if (payloadData.status === 'USER_LIST') {
                // Update the list of connected users
                setConnectedUsers(Array.from(payloadData.userList));
            } else if (payloadData.status === 'READY') {
                // Both users are ready, navigate to the game page or start the game
                console.log('Both users are ready. Starting the game...');
                navigate(`/game/${roomId}`);
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
        updateEnteredPlayerId(0, roomId); // Set enteredPlayerId to 0 or -1 to indicate leaving

        if (stompClientRef.current && stompClientRef.current.connected) {
            let chatMessage = {
                senderName: user.username,
                status: 'LEAVE',
                userId: user.userInformation?.id,
            };
            stompClientRef.current.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
            stompClientRef.current.disconnect(() => console.log('Disconnected from WebSocket'));
            setConnected(false);
        }
    };

    const onError = (error) => {
        console.error('WebSocket Error:', error);
    };

    // Function to update enteredPlayerId
    const updateEnteredPlayerId = async (enteredPlayerId, roomId) => {
        try {
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

    // Function to handle Ready button click
    const handleReadyClick = async () => {
        try {
            // Toggle ready status locally
            const newReadyStatus = !isReady;
            setIsReady(newReadyStatus);

            // Determine the hostId and userId
            const hostId = parseInt(roomId); // Assuming roomId is the hostId
            const userId = user.userInformation.id;

            // Send PUT request to the server using Fetch
            const response = await fetch(`/api/room/${hostId}/ready`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId }),
            });

            if (response.ok) {
                const data = await response.text();
                console.log('Ready status updated successfully:', data);
            } else {
                console.error('Error updating ready status:', response.statusText);
            }
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

            {/* Chat Messages */}
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
                                {item.senderName !== user.username ? (
                                    <strong>{item.senderName}:</strong>
                                ) : (
                                    <strong>나:</strong>
                                )}{' '}
                                {item.message}
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
                />
                <Button variant="contained" color="primary" onClick={sendMessage}>
                    전송
                </Button>
                <Button
                    variant="contained"
                    color={isReady ? 'secondary' : 'primary'}
                    onClick={handleReadyClick}
                >
                    {isReady ? '준비 취소' : '준비'}
                </Button>
                {/* ... Other buttons ... */}
            </div>
        </div>
    );
};
