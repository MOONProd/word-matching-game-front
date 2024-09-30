// src/pages/MainPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/fonts/font.css';
import { useChat } from './ChatLogic';
import { FaUserFriends } from 'react-icons/fa';
import RuleModal from '../modal/RuleModal';
import RankModal from '../modal/RankModal';
import LogoutModal from '../modal/LogoutModal';
import UserListModal from '../modal/UserListModal';

import { useRecoilState } from 'recoil';
import { userAtom } from '../recoil/userAtom';

function MainPage() {
    const [user,setUser] = useRecoilState(userAtom);
    
    const [sortedUserData, setSortedUserData] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRankOpen, setIsRankOpen] = useState(false);
    const [isLogoutModal, setIsLogoutModal] = useState(false);
    const [isUserListOpen, setIsUserListOpen] = useState(false);

    // Animation states for modals
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    
    // 개별 애니메이션 상태 관리
    const [isModalAnimating, setIsModalAnimating] = useState(false);
    const [isRankAnimating, setIsRankAnimating] = useState(false);

    const [hovered, setHovered] = useState(null);
    const navigate = useNavigate();

    const { messages, sendMessage, connectedUsers, handleUserLeave } = useChat();
    const [message, setMessage] = useState('');

    // Ref for scrolling chat to bottom
    const messagesEndRef = useRef(null);

    // 서버에서 순위 데이터를 가져오는 함수
    const fetchRankData = async () => {
        try {
            const response = await fetch('/api/scores'); // 서버로부터 모든 유저의 점수 및 이름 가져오기
            const data = await response.json();

            // 점수를 내림차순으로 정렬
            const sortedData = data.sort((a, b) => b.userScore - a.userScore);
            setSortedUserData(sortedData); // 정렬된 데이터를 상태로 설정
        } catch (error) {
            console.error('Error fetching rank data:', error);
        }
    };

    // 페이지가 로드될 때 데이터를 가져오는 useEffect
    useEffect(() => {
        fetchRankData();
    }, []);

    // useEffect(() => {
    //     // 새로고침 여부를 sessionStorage에 저장하여 확인
    //     const hasReloaded = sessionStorage.getItem('hasReloaded');

    //     if (!hasReloaded) {
    //         // 새로고침이 아직 실행되지 않았다면 새로고침을 한 번 실행
    //         sessionStorage.setItem('hasReloaded', 'true'); // 새로고침된 상태로 저장
    //         // window.location.reload();
    //         navigate(0);
    //     }
    // }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (user === null) {
            console.log('User has been logged out', user);
        }
    }, [user]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            sendMessage(message);
            setMessage('');
        }
    };

    const handleInfoClick = (e) => {
        e.stopPropagation(); // 클릭 이벤트가 부모 요소로 전파되지 않도록 함
        setIsInfoModalOpen(!isInfoModalOpen); // '내 정보' 모달 열기/닫기
    };

    const toggleState = (event) => {
        const target = event.currentTarget.getAttribute('data-target');
        let isOpen, setIsOpen, setIsAnimating;

        switch (target) {
            case 'modal':
                isOpen = isModalOpen;
                setIsOpen = setIsModalOpen;
                setIsAnimating = setIsModalAnimating;
                break;
            case 'rank':
                isOpen = isRankOpen;
                setIsOpen = setIsRankOpen;
                setIsAnimating = setIsRankAnimating;
                break;
            case 'logout':
                isOpen = isLogoutModal;
                setIsOpen = setIsLogoutModal;
                setIsOpen(!isOpen);
                return;
            case 'userlist':
                isOpen = isUserListOpen;
                setIsOpen = setIsUserListOpen;
                setIsOpen(!isOpen); // Toggle without animation
                return;
            default:
                return;
        }

        // Modal animation logic
        if (isOpen) {
            setIsAnimating(false);
            setTimeout(() => {
                setIsOpen(false);
            }, 500);
        } else {
            setIsOpen(true);
            setTimeout(() => {
                setIsAnimating(true);
            }, 10);
        }
    };

    const handleMouseEnter = (direction) => {
        setHovered(direction);
    };

    const handleMouseLeave = () => {
        setHovered(null);
    };

    const handleSignClick = (event) => {
        const path = event.currentTarget.getAttribute('data-path');
        navigate(path);
    };

    const handleLogout = () => {
        const accessToken = localStorage.getItem('accessToken');

        fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies if necessary
        })
            .then(response => {
                if (response.ok) {

                    handleUserLeave();
                    // Clear tokens from localStorage
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');

                    // sessionStorage.removeItem('hasReloaded');

                    setUser(null);

                    // Redirect to login page
                    navigate('/');
                } else {
                    throw new Error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
                // Handle error appropriately (e.g., show a message)
            });
    };
        // 오버레이 클릭 시 모달 닫기
        const handleOverlayClick = () => {
            setIsInfoModalOpen(false);
        };

    return (
        <div className="flex flex-col items-center justify-center relative h-screen"
             style={{
                 width: '100%',
                 height: '100vh',
                 backgroundImage: 'url(../src/assets/images/bg.png)',
                 backgroundSize: '100% auto',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
             }}
        >
            {/* <img src='../src/assets/images/bg.png'
                 style={{width: '100%', height: '100vh', zIndex: -1}}/> */}
            <img
                src="../src/assets/images/title.png"
                className="mt-5 w-1/2 max-w-ms h-auto"
                alt="Title"
                style={{
                    position: 'absolute',
                    top: '2%',
                    objectFit: 'contain',
                }}
            />
            {/* Left Sign Image */}
            <img
                src="../src/assets/images/leftSign.png"
                className="w-1/6 max-w-xs h-auto"
                alt="Left Sign"
                style={{
                    position: 'absolute',
                    left: '5%',
                    bottom: '25%',
                    objectFit: 'contain',
                    cursor: 'pointer',
                    transform: hovered === 'left' ? 'rotate(-10deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                }}
                data-path="/main/firstPlay"
                onClick={handleSignClick}
                onMouseEnter={() => handleMouseEnter('left')}
                onMouseLeave={handleMouseLeave}
            />

            {/* Right Sign Image */}
            <img
                src="../src/assets/images/rightSign.png"
                className="w-1/6 max-w-xs h-auto"
                alt="Right Sign"
                style={{
                    position: 'absolute',
                    right: '5%',
                    bottom: '25%',
                    objectFit: 'contain',
                    cursor: 'pointer',
                    transform: hovered === 'right' ? 'rotate(10deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                }}
                data-path="/main/secondPlay"
                onClick={handleSignClick}
                onMouseEnter={() => handleMouseEnter('right')}
                onMouseLeave={handleMouseLeave}
            />

            {/* Buttons */}
            <div className="absolute bottom-20 flex flex-col mb-4"
                 style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
                <div>
                    <button
                        className="border-solid border-2 border-black rounded-full 
                        bg-white px-8 py-3 text-2xl hover:bg-gray-200 transition duration-150"
                        data-target="modal"
                        onClick={toggleState}>
                        게임방법
                    </button>
                </div>
                <div className="mt-4">
                    <button
                        className="border-solid border-2 border-black rounded-full 
                        bg-white px-8 py-3 text-2xl hover:bg-gray-200 transition duration-150"
                        data-target="rank"
                        onClick={toggleState}>
                        이웃순위
                    </button>
                </div>
            </div>

            <div className="absolute top-2 right-20 flex flex-col mb-4"
                 style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
                <div>
                    <button
                        className="border-solid border-2 border-black rounded-full 
                        bg-white px-4 py-1 text-sm font-bold hover:bg-gray-200 transition duration-150"
                        onClick={handleInfoClick}>
                        내 정보
                    </button>
                </div>
            </div>


            {/* '내 정보' 모달 */}
            {isInfoModalOpen && (
                <div 
                    className="fixed inset-0 flex items-start justify-end bg-black bg-opacity-50"
                    onClick={handleOverlayClick} // 오버레이 클릭 시 모달 닫기
                >
                    {/* 모달 클릭 시 이벤트 전파 중지 */}
                    <div 
                        className="bg-white text-center p-4 rounded-lg max-w-xs w-full mt-16 mr-10"
                        style={{ fontFamily: 'MyCustomFont, sans-serif', width: '150px' }} // 모달 너비 줄이기
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className="rounded-full w-16 h-16 mx-auto" // 프로필 사진 크기 50*50 (w-16, h-16)
                        />
                        <hr className="my-4 border-gray-300" />
                        <button
                            className="block text-black mb-4 mx-auto" // 중앙 정렬을 위해 mx-auto 추가
                            onClick={() => navigate('/main/info')}
                        >
                            정보 확인
                        </button>
                        <button
                            className="block text-red-500 mx-auto" // 중앙 정렬을 위해 mx-auto 추가
                            onClick={toggleState}
                            data-target='logout'
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            )}

            {/* Main Page Chat */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                width: '500px',
                height: '200px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '10px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                color: 'white',
            }}>
                <div className="flex justify-between items-center">
                    <h3>전체채팅</h3>
                    {/* Connected Users Icon */}
                    <button onClick={toggleState}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}
                            data-target="userlist">
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
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="메시지를 입력하세요."
                        style={{ flexGrow: 1, marginRight: '10px', padding: '5px', color: 'black' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                handleSendMessage();
                            }
                        }}
                    />
                    <button onClick={handleSendMessage} style={{ padding: '5px 10px' }}>
                        Send
                    </button>
                </div>
            </div>

            {/* Rule Modal */}
            <RuleModal
                isOpen={isModalOpen}
                isAnimating={isModalAnimating}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Rank Modal */}
            <RankModal
                isOpen={isRankOpen}
                isAnimating={isRankAnimating}
                onClose={() => setIsRankOpen(false)}
                userData={sortedUserData}
            />

            {/* Logout Modal */}
            <LogoutModal
                isOpen={isLogoutModal}
                onLogout={handleLogout}
                onClose={() => setIsLogoutModal(false)}
            />

            {/* Connected Users Modal */}
            <UserListModal
                isOpen={isUserListOpen}
                onClose={() => setIsUserListOpen(false)}
                connectedUsers={connectedUsers}
            />

        </div>
    );
}

export default MainPage;