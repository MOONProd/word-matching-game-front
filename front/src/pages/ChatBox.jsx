// src/components/ChatBox.jsx

import React, { useEffect, useRef } from 'react';
import { FaUserFriends } from 'react-icons/fa';

const ChatBox = ({
                     messages,
                     sendMessage,
                     messageContent,
                     setMessageContent,
                     toggleUserList, // Function to toggle the connected users list
                     isOpen, // Boolean to control visibility
                 }) => {
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (messageContent.trim() !== '') {
            sendMessage(messageContent);
            setMessageContent('');
        }
    };

    if (!isOpen) {
        return null; // Do not render anything if the chatbox is closed
    }

    return (
        <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            width: '500px',
            height: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            zIndex: 1000, // Ensure the chatbox is above other elements
        }}>
            <div className="flex justify-between items-center mb-2">
                <h3>전체채팅</h3>
                {/* Connected Users Icon */}
                <button onClick={toggleUserList}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}
                        title="사용자 목록 보기">
                    <FaUserFriends size={24} />
                </button>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '10px' }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {messages.map((msg, index) => (
                        <li key={index} style={{ padding: '5px 0' }}>
                            {msg.status === 'JOIN' || msg.status === 'LEAVE' ? (
                                <strong>{`${msg.senderName}님이 ${msg.status === 'JOIN' ? '들어왔습니다.' : '나갔습니다.'}`}</strong>
                            ) : (
                                <>
                                    <strong>{msg.senderName}:</strong> {msg.message}
                                </>
                            )}
                        </li>
                    ))}
                    {/* Dummy div for scrolling */}
                    <div ref={messagesEndRef} />
                </ul>
            </div>
            <div style={{ display: 'flex' }}>
                <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="메시지를 입력하세요."
                    style={{ flexGrow: 1, marginRight: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                            handleSendMessage();
                        }
                    }}
                />
                <button onClick={handleSendMessage} style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    cursor: 'pointer',
                }}>
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
