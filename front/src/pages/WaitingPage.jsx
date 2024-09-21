// src/components/WaitingPage.jsx
import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import '../Chat.css';

let stompClient = null;

export const WaitingPage = () => {
    const [publicChats, setPublicChats] = useState([]);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        receiverName: "",
        connected: false,
        message: ""
    });

    // Use Recoil's useRecoilValue to get userAtom
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.username) {
            // Initiate WebSocket connection
            registerUser(user.username);
        } else {
            // If user data is not available, navigate to login or handle accordingly
            navigate('/login');
        }
    }, [user, navigate]);

    const registerUser = (username) => {
        console.log("Registering user:", username);
        let Sock = new SockJS('/ws');  // Using relative URL for WebSocket connection
        stompClient = over(Sock);
        stompClient.connect({}, () => onConnected(username), onError);
    };

    const onConnected = (username) => {
        console.log("Connected to WebSocket as:", username);
        setUserData(prevData => ({ ...prevData, connected: true }));
        stompClient.subscribe('/chatroom/public', onPublicMessageReceived);
        stompClient.subscribe(`/user/${username}/private`, onPrivateMessageReceived);
        userJoin(username);
    };

    const userJoin = (username) => {
        let chatMessage = {
            senderName: username,
            status: "JOIN"
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };

    const onPublicMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                setPublicChats(prevChats => [...prevChats, payloadData]);
                break;
            default:
                break;
        }
    };

    const onPrivateMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    };

    const onError = (error) => {
        console.log("WebSocket Error:", error);
    };

    const handleMessageChange = (event) => {
        const { value } = event.target;
        setUserData(prevData => ({ ...prevData, message: value }));
    };

    const sendPublicMessage = () => {
        if (stompClient) {
            let chatMessage = {
                senderName: user.username, // Use username from userAtom
                message: userData.message,
                status: "MESSAGE"
            };
            stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
            setUserData(prevData => ({ ...prevData, message: "" }));
        }
    };

    const sendPrivateMessage = () => {
        if (stompClient) {
            let chatMessage = {
                senderName: user.username, // Use username from userAtom
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };
            if (user.username !== tab) {
                if (!privateChats.get(tab)) {
                    privateChats.set(tab, []);
                }
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
            setUserData(prevData => ({ ...prevData, message: "" }));
        }
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            <li
                                onClick={() => setTab("CHATROOM")}
                                className={`member ${tab === "CHATROOM" ? "active" : ""}`}
                            >
                                Chatroom
                            </li>
                            {[...privateChats.keys()].map((name, index) => (
                                <li
                                    onClick={() => setTab(name)}
                                    className={`member ${tab === name ? "active" : ""}`}
                                    key={index}
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {tab === "CHATROOM" ? (
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
                </div>
            ) : (
                <div className="register">
                    {/* Removed username input and Connect button */}
                    <div>Connecting to chat...</div>
                </div>
            )}
        </div>
    );
};
