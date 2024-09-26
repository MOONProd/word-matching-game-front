// components/modal/UserListModal.js
import React from 'react';

const UserListModal = ({ isOpen, onClose, connectedUsers }) => {
    if (!isOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

    return (
        <div style={{
            position: 'absolute',
            bottom: '215px', // 채팅창 위로 배치되도록 설정, 채팅창 높이 + 약간의 간격
            left: '310px', // 채팅창의 왼쪽 위치와 동일하게 설정
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
                {connectedUsers.map((username, index) => (
                    <li key={index} style={{ padding: '5px 0' }}>
                        {username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserListModal;
