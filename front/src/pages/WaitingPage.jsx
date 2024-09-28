// src/components/WaitingPage.js

import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useParams, useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

export const WaitingPage = () => {
    const user = useRecoilValue(userAtom);
    const { roomId } = useParams();
    const navigate = useNavigate(); // Hook for navigation

    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [otherUserIsReady, setOtherUserIsReady] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentTurn, setCurrentTurn] = useState(null); // Will hold userId of the current turn
    const [otherUserId, setOtherUserId] = useState(null);
    const [gameOver, setGameOver] = useState(false); // New state variable
    const [gameResult, setGameResult] = useState(''); // To store 'You won' or 'You lose'

    const stompClientRef = useRef(null);
    const roomIdRef = useRef(roomId);
    const chatEndRef = useRef(null);

    // Ensure user IDs are numbers
    const userId = Number(user.userInformation.id);
    const roomHostId = Number(roomId);

    const isHost = userId === roomHostId;

    useEffect(() => {
        roomIdRef.current = roomId;
    }, [roomId]);

    useEffect(() => {
        if (user && user.username && roomId && !stompClientRef.current && userId != null) {
            connectWebSocket(user.username, userId, roomId);
            updateEnteredPlayerId(userId, roomId);
        }
    }, [user, roomId, userId]);

    useEffect(() => {
        return () => {
            handleUserLeave(roomIdRef.current);
        };
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            handleUserLeave(roomIdRef.current);
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const connectWebSocket = (username, userId, roomId) => {
        let Sock = new SockJS('/ws');
        const client = over(Sock);
        stompClientRef.current = client;

        const headers = {
            username: username,
            roomId: roomId,
        };

        client.connect(headers, () => onConnected(username, userId, roomId), onError);
    };

    const onConnected = (username, userId, roomId) => {
        setConnected(true);

        stompClientRef.current.subscribe(`/room/${roomId}/public`, onMessageReceived);

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
                const uniqueUsers = Array.from(new Set(payloadData.userList));
                setConnectedUsers(uniqueUsers);
            } else if (payloadData.status === 'READY' || payloadData.status === 'NOT_READY') {
                const senderUserId = Number(payloadData.userId);
                const isSenderReady = payloadData.status === 'READY';

                if (senderUserId !== userId) {
                    setOtherUserIsReady(isSenderReady);
                    setOtherUserId(senderUserId);
                    console.log('Set otherUserIsReady:', isSenderReady);
                } else {
                    setIsReady(isSenderReady);
                    console.log('Set isReady:', isSenderReady);
                }
            } else if (payloadData.status === 'JOIN') {
                setMessages((prevMessages) => [...prevMessages, payloadData]);
                const joinedUserId = Number(payloadData.userId);
                if (joinedUserId !== userId) {
                    setOtherUserId(joinedUserId);
                    console.log('Set otherUserId (JOIN):', joinedUserId);
                }
            } else if (payloadData.status === 'LEAVE') {
                setMessages((prevMessages) => [...prevMessages, payloadData]);
                if (payloadData.userId !== userId) {
                    setOtherUserIsReady(false);
                    setOtherUserId(null);
                }
                if (payloadData.userId === userId) {
                    setIsReady(false);
                }
            } else if (payloadData.status === 'GAME_IS_ON') {
                setMessages((prevMessages) => [...prevMessages, payloadData]);

                if (!gameStarted) {
                    // Game starts
                    setGameStarted(true);

                    // Set the initial turn based on the userId provided in the message
                    const startingUserId = Number(payloadData.userId);
                    setCurrentTurn(startingUserId);
                    console.log('Game started. Current turn set to userId:', startingUserId);
                }
            } else if (payloadData.status === 'TURN_CHANGE') {
                // Update the current turn based on the TURN_CHANGE message from the server
                setCurrentTurn(payloadData.userId);
                console.log('Turn changed. Current turn set to userId:', payloadData.userId);
            } else if (payloadData.status === 'GAME_IS_OFF') {
                // Handle game over
                if (Number(payloadData.userId) === userId) {
                    alert(payloadData.message);
                    setGameResult(payloadData.message); // Set game result
                    if (payloadData.message === 'You won') {
                        // Call API to update score
                        updateWinnerScore();
                    }
                }
                setGameStarted(false); // Reset game
                setCurrentTurn(null);
                setGameOver(true); // Set gameOver to true
                setMessages((prevMessages) => [...prevMessages, payloadData]);
            } else if (payloadData.status === 'ERROR') {
                if (Number(payloadData.userId) === userId) {
                    alert(payloadData.message);
                }
            } else {
                // Regular messages
                setMessages((prevMessages) => [...prevMessages, payloadData]);
            }

            // Ensure otherUserId is set whenever we receive a message from the other user
            if (payloadData.userId && Number(payloadData.userId) !== userId && Number(payloadData.userId) !== otherUserId) {
                setOtherUserId(Number(payloadData.userId));
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
                status: 'GAME_IS_ON',
                userId: userId,
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
            stompClientRef.current = null;
            setConnected(false);
        }
    };

    const onError = (error) => {
        console.error('WebSocket Error:', error);
    };

    const updateEnteredPlayerId = async (enteredPlayerId, roomId) => {
        try {
            const response = await fetch(`/api/room/${roomId}/enter?enteredPlayerId=${enteredPlayerId}`, {
                method: 'GET',
            });

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

    const updateReadyStatusOnServer = async (readyStatus) => {
        try {
            const hostId = roomHostId;
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
                console.log('Ready status updated successfully:', data);
                // The server will broadcast the readiness status
            } else {
                console.error('Error updating ready status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating ready status:', error);
        }
    };

    const handleReadyClick = async () => {
        try {
            const hostId = roomHostId;
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
                // The server will broadcast the readiness status
            } else {
                console.error('Error updating ready status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating ready status:', error);
        }
    };

    const updateWinnerScore = async () => {
        try {
            const response = await fetch('/api/score/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId }),
            });

            if (response.ok) {
                console.log('Score updated successfully');
            } else {
                console.error('Error updating score:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating score:', error);
        }
    };

    const isInputDisabled = currentTurn !== userId;

    // If the game is over, display the game over message and button
    if (gameOver) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-blue-50">
                <h1 className="text-4xl font-bold mb-4">Game is over</h1>
                <p className="text-2xl mb-4">{gameResult}</p>
                <Button variant="contained" color="primary" onClick={() => navigate('/main')}>
                    Go back to main
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-blue-50">
            {/* Header Area */}
            <div className="flex justify-between items-center p-4 bg-blue-200 shadow">
                <h2 className="text-xl font-bold">플레이어 준비 상태</h2>
                <div className="flex space-x-4">
                    <span>{`당신은 ${isReady ? '준비 완료' : '준비 안됨'}`}</span>
                    <span>{`상대방은 ${otherUserIsReady ? '준비 완료' : '준비 안됨'}`}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-grow">
                {/* Left Side: Connected Users */}
                <div className="w-1/4 bg-white p-4 border-r border-gray-200">
                    <h3 className="text-lg font-bold mb-4">접속자 목록</h3>
                    <ul>
                        {connectedUsers.map((username, index) => (
                            <li key={index} className="mb-2">{username}</li>
                        ))}
                    </ul>
                </div>

                {/* Right Side: Room-specific chat */}
                <div className="flex-grow p-5 overflow-y-auto">
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
                        <div ref={chatEndRef} />
                    </ul>
                </div>
            </div>

            {/* Chat input and buttons */}
            <div className="flex justify-center p-4 space-x-2 border-t bg-gray-100">
                {!gameStarted && (
                    <Button
                        variant="contained"
                        color={isReady ? 'secondary' : 'primary'}
                        onClick={handleReadyClick}
                        disabled={connectedUsers.length < 2}
                    >
                        {isReady ? '준비 취소' : '준비'}
                    </Button>
                )}
                {gameStarted && (
                    <>
                        <TextField
                            id="outlined-basic"
                            label={
                                isInputDisabled
                                    ? '상대방의 차례입니다.'
                                    : '메시지를 입력하세요'
                            }
                            variant="outlined"
                            value={messageContent}
                            onChange={handleMessageChange}
                            className="flex-grow"
                            disabled={isInputDisabled}
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
                            disabled={isInputDisabled}
                        >
                            전송
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
};
