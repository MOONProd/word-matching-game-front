// components/modal/UserListModal.js
import React from 'react';

const UserListModal = ({ isOpen, onClose, connectedUsers }) => {
    if (!isOpen) return null; // Do not render if the modal is closed

    // Ensure uniqueness
    const uniqueUsers = Array.from(new Set(connectedUsers));

    return (
        <div style={{
            position: 'absolute',
            bottom: '215px', // Position above the chat window
            left: '310px', // Align with chat window
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '5px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
            padding: '10px',
            width: '200px',
            zIndex: 1000,
            color: 'white'
        }}>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg">접속자 목록</h4>
            </div>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {uniqueUsers.map((username, index) => (
                    <li key={index} style={{ padding: '5px 0' }}>
                        {username}
                    </li>
                ))}
            </ul>
            <button onClick={onClose} style={{ marginTop: '10px' }}>Close</button>
        </div>
    );
};

export default UserListModal;
