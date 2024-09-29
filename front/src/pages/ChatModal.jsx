// src/components/ChatModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from './ChatLogic'; // Ensure correct path
import { FaTimes } from 'react-icons/fa';

const ChatModal = ({ isOpen, onClose }) => {
    const { messages, sendMessage, connectedUsers } = useChat();
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            sendMessage(message);
            setMessage('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* 고정된 크기 및 모달 창 설정 */}
            <div className="bg-white rounded-lg w-3/4 max-w-lg p-4 relative flex flex-col" style={{ height: '500px' }}>
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">전체채팅</h2>
                <div className="flex justify-between items-center mb-2">
                    <span>Connected Users: {connectedUsers.length}</span>
                </div>
                
                {/* 대화 내용 영역 */}
                <div className="flex-grow overflow-y-auto mb-4 border border-gray-300 p-2 rounded" style={{ height: '300px' }}>
                    <ul className="list-none p-0">
                        {messages.map((msg, index) => (
                            <li key={index} className="mb-2">
                                {msg.status === 'JOIN' || msg.status === 'LEAVE' ? (
                                    <strong>{`${msg.senderName}님이 ${msg.status === 'JOIN' ? '들어왔습니다.' : '나갔습니다.'}`}</strong>
                                ) : (
                                    <>
                                        <strong>{msg.senderName}:</strong> {msg.message}
                                    </>
                                )}
                            </li>
                        ))}
                        <div ref={messagesEndRef} />
                    </ul>
                </div>
                
                {/* 입력 및 전송 버튼 */}
                <div className="flex">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="메시지를 입력하세요."
                        className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                handleSendMessage();
                            }
                        }}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
