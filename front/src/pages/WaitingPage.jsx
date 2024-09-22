import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../Chat.css';
import { userPresenceAtom } from '../recoil/userPresenseAtom.jsx';
import { stompClientAtom } from '../recoil/stompclientAtom.jsx';

let stompClient = null;

export const WaitingPage = () => {
    const [publicChats, setPublicChats] = useState([]);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [tab, setTab] = useState('CHATROOM');
    const [userData, setUserData] = useState({
        receiverName: '',
        connected: false,
        message: '',
    });
    const [roomStatus, setRoomStatus] = useState({
        hostReady: false,
        visitorReady: false,
    });

    const user = useRecoilValue(userAtom);
    const [userPresence, setUserPresence] = useRecoilState(userPresenceAtom);
    const navigate = useNavigate();
    const { roomId } = useParams(); // Get roomId from URL
    const location = useLocation(); // Get additional state (e.g., isHost)
    const isHost = location.state?.isHost || false; // Determine if the user is the host

    // Effect to handle WebSocket connection
    useEffect(() => {
        if (user && user.username && roomId) {
            // Initiate WebSocket connection
            registerUser(user.username);
            setUserPresence((prev) => ({ ...prev, roomId: roomId }));

            if (!isHost) {
                // If the user is a visitor, update room_status_info when entering the room
                updateEnteredPlayerId(roomId, user.userInformation.id);
            }
        } else {
            // If user data is not available, navigate to login or handle accordingly
            navigate('/login');
        }

        // Handle browser refresh or closing the tab
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = ''; // This prompts the user with the default browser message on page unload
            handleUserLeave();
            alert("다시들어오렴");
            navigate('/');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Handle back button navigation or any route change
        const handlePopState = () => {
            if (window.confirm('Are you sure you want to leave?')) {
                handleUserLeave();
                navigate('/firstPlay'); // Navigate to firstPlay if the user confirms to leave
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Clean up listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [user, navigate, roomId]);

    // Handle WebSocket connection
    const registerUser = (username) => {
        console.log('Registering user:', username);
        let Sock = new SockJS('/ws');
        stompClient = over(Sock);
        stompClient.connect({}, () => onConnected(username), onError);
    };

    // Handle successful connection
    const onConnected = (username) => {
        console.log('Connected to WebSocket as:', username);
        setUserData((prevData) => ({ ...prevData, connected: true }));

        // Subscribe to the room's public chat
        stompClient.subscribe(`/room/${roomId}/public`, onPublicMessageReceived);

        // Subscribe to private messages
        stompClient.subscribe(`/user/${username}/private`, onPrivateMessageReceived);

        // Notify that user has joined the room
        userJoin(username);
    };

    // Send join message to the room's public channel
    const userJoin = (username) => {
        let chatMessage = {
            senderName: username,
            status: 'JOIN',
        };
        stompClient.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
    };

    // Handle user leave
    const handleUserLeave = () => {
        console.log('User leaving');
        if (stompClient && stompClient.connected) {
            let chatMessage = {
                senderName: user.username,
                status: 'LEAVE',
            };
            stompClient.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
            stompClient.disconnect(() => console.log('Disconnected from WebSocket'));
        }
    };

    // Handle public and private messages
    const onPublicMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case 'JOIN':
                if (payloadData.senderName !== user.username) {
                    if (!privateChats.get(payloadData.senderName)) {
                        privateChats.set(payloadData.senderName, []);
                        setPrivateChats(new Map(privateChats));
                    }
                }
                break;
            case 'LEAVE':
                // Log the event when another user leaves
                console.log(`User ${payloadData.senderName} has left the room.`);
                break;
            case 'MESSAGE':
                setPublicChats((prevChats) => [...prevChats, payloadData]);
                break;
            default:
                break;
        }
    };

    const onPrivateMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        if (payloadData.senderName !== user.username) {
            if (privateChats.get(payloadData.senderName)) {
                privateChats.get(payloadData.senderName).push(payloadData);
                setPrivateChats(new Map(privateChats));
            } else {
                let list = [];
                list.push(payloadData);
                privateChats.set(payloadData.senderName, list);
                setPrivateChats(new Map(privateChats));
            }
        }
    };

    const onError = (error) => {
        console.log('WebSocket Error:', error);
    };

    // Message handlers
    const handleMessageChange = (event) => {
        const { value } = event.target;
        setUserData((prevData) => ({ ...prevData, message: value }));
    };

    const sendPublicMessage = () => {
        if (stompClient) {
            let chatMessage = {
                senderName: user.username,
                message: userData.message,
                status: 'MESSAGE',
            };
            stompClient.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
            setUserData((prevData) => ({ ...prevData, message: '' }));
        }
    };

    const sendPrivateMessage = () => {
        if (stompClient) {
            let chatMessage = {
                senderName: user.username,
                receiverName: tab,
                message: userData.message,
                status: 'MESSAGE',
            };
            if (user.username !== tab) {
                if (!privateChats.get(tab)) {
                    privateChats.set(tab, []);
                }
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
            setUserData((prevData) => ({ ...prevData, message: '' }));
        }
    };

    const updateEnteredPlayerId = (hostId, enteredPlayerId) => {
        console.log('hostId:', hostId);
        console.log('enteredPlayerId:', enteredPlayerId);

        fetch(`/api/room/${hostId}/enter?enteredPlayerId=${enteredPlayerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update room status');
                }
                console.log('Room status updated successfully');
            })
            .catch((error) => {
                console.error('Error updating room status:', error);
                alert('The room does not exist.');
                navigate('/firstPlay');
            });
    };

    const handleReadyStatus = () => {
        fetch(`/api/room/${roomId}/ready`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.userInformation.id }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update ready status');
                }
                console.log('Ready status updated successfully');
            })
            .catch((error) => {
                console.error('Error updating ready status:', error);
            });
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            <li
                                onClick={() => setTab('CHATROOM')}
                                className={`member ${tab === 'CHATROOM' ? 'active' : ''}`}
                            >
                                Chatroom
                            </li>
                            {[...privateChats.keys()].map((name, index) => (
                                <li
                                    onClick={() => setTab(name)}
                                    className={`member ${tab === name ? 'active' : ''}`}
                                    key={index}
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {tab === 'CHATROOM' ? (
                        <div className="chat-content">
                            <ul className="chat-message">
                                {publicChats.map((chat, index) => (
                                    <li className="member" key={index}>
                                        {chat.senderName !== user.username && (
                                            <div className="avatar">{chat.senderName}</div>
                                        )}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderName === user.username && (
                                            <div className="avatar self">{chat.senderName}</div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="send-message">
                                <input
                                    type="text"
                                    className="input-message"
                                    name="message"
                                    placeholder="Enter public message"
                                    value={userData.message}
                                    onChange={handleMessageChange}
                                />
                                <button
                                    type="button"
                                    className="send-button"
                                    onClick={sendPublicMessage}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="chat-content">
                            <ul className="chat-message">
                                {privateChats.get(tab) &&
                                    privateChats.get(tab).map((chat, index) => (
                                        <li className="member" key={index}>
                                            {chat.senderName !== user.username && (
                                                <div className="avatar">{chat.senderName}</div>
                                            )}
                                            <div className="message-data">{chat.message}</div>
                                            {chat.senderName === user.username && (
                                                <div className="avatar self">{chat.senderName}</div>
                                            )}
                                        </li>
                                    ))}
                            </ul>
                            <div className="send-message">
                                <input
                                    type="text"
                                    className="input-message"
                                    name="message"
                                    placeholder={`Enter private message for ${tab}`}
                                    value={userData.message}
                                    onChange={handleMessageChange}
                                />
                                <button
                                    type="button"
                                    className="send-button"
                                    onClick={sendPrivateMessage}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="ready-button">
                        <button onClick={handleReadyStatus}>
                            {roomStatus.hostReady && roomStatus.visitorReady
                                ? 'Both Ready'
                                : 'Click to Ready'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="register">
                    <div>Connecting to chat...</div>
                </div>
            )}
        </div>
    );
};
