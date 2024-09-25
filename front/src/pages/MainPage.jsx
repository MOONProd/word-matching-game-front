import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/fonts/font.css';
import { useChat } from './ChatLogic';
import { FaUserFriends } from 'react-icons/fa';
import RuleModal from '../modal/RuleModal';
import RankModal from '../modal/RankModal';
import LogoutModal from '../modal/LogoutModal';
import UserListModal from '../modal/UserListModal';


function MainPage() {
    const userData = [
        { id: 1, username: '이웃1', score: 100, profilePic: 'https://via.placeholder.com/150' },
        { id: 2, username: '이웃2', score: 90, profilePic: 'https://via.placeholder.com/150' },
        { id: 3, username: '이웃3', score: 85, profilePic: 'https://via.placeholder.com/150' },
        { id: 4, username: '이웃4', score: 80, profilePic: 'https://via.placeholder.com/150' },
        { id: 5, username: '이웃5', score: 75, profilePic: 'https://via.placeholder.com/150' },
    ]; // 유저 점수 데이터 예시

    // 점수 기준으로 내림차순 정렬
    const sortedUserData = userData.sort((a, b) => b.score - a.score);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRankOpen, setIsRankOpen] = useState(false);
    const [isLogoutModal, setIsLogoutModal] = useState(false);
    
    // 개별 애니메이션 상태 관리
    const [isModalAnimating, setIsModalAnimating] = useState(false);
    const [isRankAnimating, setIsRankAnimating] = useState(false);
    const [isUserListOpen, setIsUserListOpen] = useState(false);

    const [hovered, setHovered] = useState(null);
    const navigate = useNavigate();

    const { messages, sendMessage, connectedUsers } = useChat();
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            sendMessage(message); // 메시지 전송
            setMessage(''); // 메시지 입력 필드 초기화
        }
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
                break;
            case 'userlist': // 접속자 목록 모달 추가
                isOpen = isUserListOpen;
                setIsOpen = setIsUserListOpen;
                setIsOpen(!isOpen); // 즉시 열리고 닫히도록 설정 (애니메이션 없음)
                return;
            default:
                return;
        }
    
        // 다른 모달들의 애니메이션 로직
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
    
    const handleSignClick = (event)=>{
        const path = event.currentTarget.getAttribute('data-path');
        navigate(path);
    };

    const handleLogout = () => {
        const accessToken = localStorage.getItem('accessToken');

        fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Include cookies if necessary
        })
            .then(response => {
                if (response.ok) {
                    // Clear tokens from localStorage
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
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

    return (
        <div className="flex flex-col items-center justify-center relative h-screen"
                style={{
                    width: '100%',
                    height: '100vh',
                    backgroundImage: 'url(../src/assets/images/bg.png)',
                    backgroundSize: '100% auto', // 가로를 100%로 맞추고, 세로는 비율에 맞게 조정
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
        >
            <img
            src="../src/assets/images/title.png"
            className="mt-5 w-1/2 max-w-ms h-auto"
            alt="Title"
            style={{ 
                position: 'absolute',
                top: '2%',
                objectFit: 'contain', // 이미지가 비율을 유지하며 잘리지 않도록 설정
            }}
            />
            {/* 왼쪽 사인 이미지 */}
            <img 
            src="../src/assets/images/leftSign.png" 
            className="w-1/6 max-w-xs h-auto"  // 너비를 부모의 1/4로 설정하고, 최대 너비를 제한
            alt="Left Sign" 
            style={{ 
                position: 'absolute',
                left: '5%',  // 화면의 5% 지점에 위치
                bottom: '25%', // 화면의 25% 지점에 위치
                objectFit: 'contain', // 이미지가 비율을 유지하며 잘리지 않도록 설정
                cursor: 'pointer',
                transform: hovered === 'left' ? 'rotate(-10deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
               
            }}
            data-path="/main/firstPlay"
            onClick={handleSignClick}
            onMouseEnter={() => handleMouseEnter('left')}
            onMouseLeave={handleMouseLeave}
            />

            {/* 오른쪽 사인 이미지 */}
            <img 
                src="../src/assets/images/rightSign.png" 
                className="w-1/6 max-w-xs h-auto"  // 너비를 부모의 1/4로 설정하고, 최대 너비를 제한
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

            {/* 버튼들 */}
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
                <div className="mt-4"> {/* 버튼 사이의 간격을 mt-4로 설정 */}
                    <button className="border-solid border-2 border-black rounded-full 
                          bg-white px-8 py-3 text-2xl hover:bg-gray-200 transition duration-150"
                            data-target="rank"
                            onClick={toggleState}>
                            이웃순위
                    </button>
                </div>
            </div>

            <div className="absolute top-2 right-8 flex flex-col mb-4"
                style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
                <div>
                    <button 
                        className="border-solid border-2 border-black rounded-full 
                        bg-white px-4 py-1 text-sm font-bold hover:bg-gray-200 transition duration-150"
                        data-target="logout"
                        onClick={toggleState}>
                        로그아웃
                    </button>
                </div>
            </div>

            {/* 메인페이지 내 전체 채팅방 */}
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
                color: 'white'
            }}>
                <div className="flex justify-between items-center">
                    <h3>전체채팅</h3>
                    {/* 접속자 목록 아이콘 */}
                    <button onClick={toggleState} 
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}
                            data-target="userlist">
                        <FaUserFriends size={24} />
                    </button>
                </div>

                <div style={{flexGrow: 1, overflowY: 'auto', marginBottom: '10px'}}>
                    <ul style={{listStyleType: 'none', padding: 0}}>
                        {messages.map((msg, index) => (
                            <li key={index} style={{padding: '5px 0'}}>
                                {msg.status === 'JOIN' || msg.status === 'LEAVE' ? (
                                    // 상태 메시지일 경우
                                    <strong>{`${msg.senderName}님이 ${msg.status === 'JOIN' ? '들어왔습니다.' : '나갔습니다.'}`}</strong>
                                ) : (
                                    // 일반 메시지일 경우
                                    <>
                                        <strong>{msg.senderName}:</strong> {msg.message}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>

                </div>
                <div style={{display: 'flex'}}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="메시지를 입력하세요."
                        style={{flexGrow: 1, marginRight: '10px', padding: '5px', color: 'black'}}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                handleSendMessage(); // 입력 구성이 완료된 후에만 메시지 전송
                            }
                        }}
                    />
                    <button onClick={handleSendMessage} style={{padding: '5px 10px'}}>
                        Send
                    </button>
                </div>
            </div>


            {/* 게임 방법 모달 */}
            <RuleModal isOpen={isModalOpen} isAnimating={isModalAnimating} onClose={() => setIsModalOpen(false)}/>

            {/* 이웃 순위 모달 */}
            <RankModal isOpen={isRankOpen} isAnimating={isRankAnimating} onClose={() => setIsRankOpen(false)} userData={sortedUserData} />

            {/* 로그아웃 모달 */}
            <LogoutModal isOpen={isLogoutModal} onLogout={handleLogout} onClose={() => setIsLogoutModal(false)} />

            {/* 접속자 목록 모달 */}
            <UserListModal isOpen={isUserListOpen} onClose={() => setIsUserListOpen(false)} connectedUsers={connectedUsers} />

        </div>
    );
}

export default MainPage;

//<a href="https://www.flaticon.com/kr/free-icons/-" title="새롭게 하다 아이콘">새롭게 하다 아이콘 제작자: GOFOX - Flaticon</a>