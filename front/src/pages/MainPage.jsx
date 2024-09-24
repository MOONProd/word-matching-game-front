import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/fonts/font.css';
import { useChat } from './ChatLogic';

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
    const [hovered, setHovered] = useState(null);
    const navigate = useNavigate();

    const [isAnimating, setIsAnimating] = useState(false);
    const { messages, sendMessage, connected } = useChat(); // Chat Logic의 상태와 함수 가져오기
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            sendMessage(message); // 메시지 전송
            setMessage(''); // 메시지 입력 필드 초기화
        }
    };

    const toggleState = (event)=>{
        const target = event.currentTarget.getAttribute('data-target');
        const isOpen = target === 'modal' ? isModalOpen : isRankOpen;
        const setIsOpen = target === 'modal' ? setIsModalOpen : setIsRankOpen;

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
                        data-target="modal"
                        onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </div>

            {/* 모달 창 배경에 이거 보류 bg-black bg-opacity-50 */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div 
                        className={`relative p-8 rounded-lg max-w-lg w-full transform transition-transform duration-500 ease-in-out
                            ${ isAnimating ? 'translate-y-0' : 'translate-y-full'}`}
                        style={{
                            backgroundImage: 'url(../src/assets/images/test-modal.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            width: '800px',
                            height: '600px',
                            fontFamily: 'MyCustomFont, sans-serif',
                        }}
                    >
                        {/* 닫기 버튼 */}
                        <button 
                            className="absolute top-4 right-4 px-4 py-2 bg-amber-700 text-white rounded-full"
                            data-target="modal"
                            onClick={toggleState}
                        >
                            닫기
                        </button>

                        {/* 텍스트 콘텐츠 */}
                        <div className="text-center text-white">
                            <h2 className="text-2xl font-bold">게임방법</h2>
                        </div>
                        <div className="flex flex-col mt-28 items-center h-full text-black text-lg">
                            <p className="text-center">이 게임은 주어진 단어로 새로운 단어를 이어가는 게임입니다.</p>
                            <p className="mt-2 text-center"><strong>예시:</strong> "사과" → "과일" → "일출"</p>
                            <br />
                            <p className="text-center">선공을 선택 시, 현재 접속한 이웃에게 대결 신청을 할 수 있습니다.</p>
                            <p className="text-center">후공을 선택 시, 원하는 지역에서 대결을 대기합니다.</p>
                            <br />
                            <p className="text-center">한 게임에서 이기면 +30점, 지면 -20점이 누적됩니다.</p>
                            <p className="text-center">누적된 점수로 순위가 매겨집니다.</p>
                        </div>
                    </div>
                </div>
            )}

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
                <h3>전체채팅</h3>
                <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '10px' }}>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {messages.map((msg, index) => (
                            <li key={index} style={{ padding: '5px 0' }}>
                                <strong>{msg.senderName}:</strong> {msg.message}
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ display: 'flex' }}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="메시지를 입력하세요."
                        style={{ flexGrow: 1, marginRight: '10px', padding: '5px', color:'black' }}
                    />
                    <button onClick={handleSendMessage} style={{ padding: '5px 10px' }}>
                        Send
                    </button>
                </div>
            </div>

            {isRankOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div 
                        className={`relative p-8 rounded-lg max-w-lg w-full transform transition-transform duration-500 ease-in-out 
                            ${ isAnimating ? 'translate-y-0' : 'translate-y-full'}`}
                        style={{
                            backgroundImage: 'url(../src/assets/images/test-modal.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            width: '800px',
                            height: '600px',
                            fontFamily: 'MyCustomFont, sans-serif',
                        }}
                    >
                        {/* 닫기 버튼 */}
                        <button 
                            className="absolute top-4 right-4 px-4 py-2 bg-amber-700 text-white rounded-full"
                            data-target="rank"
                            onClick={toggleState}
                        >
                            닫기
                        </button>

                        {/* 텍스트 콘텐츠 */}
                        <div className="text-center text-white">
                            <h2 className="text-2xl font-bold mb-4">이웃순위</h2>
                            
                            {/* 1위 사용자 */}
                            <div className="flex justify-around text-center items-center space-x-4 mb-4 text-black">
                                <img 
                                    src={sortedUserData[0].profilePic} 
                                    alt={`${sortedUserData[0].username} 프로필`}
                                    className="w-24 h-24 rounded-full mx-0 mb-4"
                                />
                                
                                    <div className="mx-10 text-xl font-bold">{sortedUserData[0].username}</div>
                                    <div className="text-lg text-green-600">{sortedUserData[0].score}점</div>
                                
                            </div>

                            {/* 2위 ~ 5위 사용자 */}
                            <ol className="list-decimal list-inside">
                                {sortedUserData.slice(1, 5).map((user, index) => (
                                    <li key={user.id} className="flex justify-around items-center mb-4 text-black">
                                        <img 
                                            src={user.profilePic} 
                                            alt={`${user.username} 프로필`}
                                            className="w-16 h-16 rounded-full mr-4"
                                        />
                                      
                                        <p className="text-lg font-semibold">{user.username}</p>
                                        <p className="text-md text-green-500">{user.score}점</p>
                                        
                                        
                                    </li>
                                ))}
                            </ol>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default MainPage;
