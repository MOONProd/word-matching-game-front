import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/fonts/font.css';

function MainPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRankOpen, setIsRankOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const navigate = useNavigate();

    const [isAnimating, setIsAnimating] = useState(false);
    
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

    return (
        <div className="flex flex-col items-center justify-center relative h-screen"
                style={{
                    width: '100%',
                    height: '100vh',
                    backgroundImage: 'url(../src/assets/background.png)',
                    backgroundSize: '100% auto', // 가로를 100%로 맞추고, 세로는 비율에 맞게 조정
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
        >
            <img
            src="../src/assets/title.png"
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
            src="../src/assets/leftSign.png" 
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
            data-path="/firstPlay"
            onClick={handleSignClick}
            onMouseEnter={() => handleMouseEnter('left')}
            onMouseLeave={handleMouseLeave}
        />

            {/* 오른쪽 사인 이미지 */}
            <img 
                src="../src/assets/rightSign.png" 
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
                data-path="/secondPlay"
                onClick={handleSignClick}
                onMouseEnter={() => handleMouseEnter('right')}
                onMouseLeave={handleMouseLeave}
            />

            {/* 버튼들 */}
            <div className="absolute bottom-20 flex flex-col mb-4"
                style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
                <div>
                    <button 
                        className="border-2 border-black rounded-full px-8 py-3 text-2xl"
                        data-target="modal"
                        onClick={toggleState}
                    >
                        게임방법
                    </button>
                </div>
                <div className="mt-4"> {/* 버튼 사이의 간격을 mt-4로 설정 */}
                    <button className="border-2 border-black rounded-full px-8 py-3 text-2xl"
                            data-target="rank"
                            onClick={toggleState}>이웃순위</button>
                </div>
            </div>

            {/* 모달 창 배경에 이거 보류 bg-black bg-opacity-50 */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div 
                        className={`relative p-8 rounded-lg max-w-lg w-full transform transition-transform duration-500 ease-in-out
                            ${ isAnimating ? 'translate-y-0' : 'translate-y-full'}`}
                        style={{
                            backgroundImage: 'url(../src/assets/test-modal.png)',
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
                            <h2 className="text-2xl font-bold mb-4">게임방법</h2>
                            <p className="mt-10">이 게임은 주어진 단어로 새로운 단어를 이어가는 게임입니다. </p>
                            <p className="mt-2"><strong>예시:</strong> "사과" → "과일" → "일출"</p>
                            <br/>
                            <p>선공을 선택 시, 현재 접속한 이웃에게 대결 신청을 할 수 있습니다.</p>
                            <p>후공을 선택 시, 원하는 지역에서 대결을 대기합니다.</p>
                            <br/>
                            <p>한 게임에서 이기면 +30점, 지면 -20점이 누적됩니다.</p>
                            <p>누적된 점수로 순위가 매겨집니다.</p>
                        </div>
                    </div>
                </div>
            )}

            {isRankOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div 
                        className={`relative p-8 rounded-lg max-w-lg w-full transform transition-transform duration-500 ease-in-out 
                            ${ isAnimating ? 'translate-y-0' : 'translate-y-full'}`}
                        style={{
                            backgroundImage: 'url(../src/assets/test-modal.png)',
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
                            <p>여기서는 이웃들의 순위를 확인할 수 있습니다. </p>
                            <p className="mt-2"><strong>순위:</strong></p>
                            <ol className="list-decimal list-inside">
                                <li>이웃1 - 100점</li>
                                <li>이웃2 - 90점</li>
                                <li>이웃3 - 85점</li>
                                <li>이웃4 - 80점</li>
                                <li>이웃5 - 75점</li>
                            </ol>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default MainPage;
