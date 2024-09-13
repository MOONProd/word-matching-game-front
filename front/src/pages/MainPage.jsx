import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRankOpen, setIsRankOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const navigate = useNavigate();

    const [isAnimating, setIsAnimating] = useState(false);
    

    const toggleModal = () => {
        if (isModalOpen) {
            setIsAnimating(false);
            setTimeout(() => {
                setIsModalOpen(false);
            }, 500);
        } else {
            setIsModalOpen(true);
            setTimeout(() => {
                setIsAnimating(true);
            }, 10);
        }
    };


    const toggleRank = () => {
        if (isRankOpen) {
            setIsAnimating(false);
            setTimeout(() => {
                setIsRankOpen(false);
            }, 500);
        } else {
            setIsRankOpen(true);
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
    
    const handleSignClickLeft = () => {
        navigate('/firstPlay');
    };
    
    const handleSignClickRight = () => {
        navigate('/secondPlay');
    };

    return (
        <div className="flex flex-col items-center justify-center relative h-screen"
                style={{
                    width: '100%',
                    height: '100vh',
                    backgroundImage: 'url(../src/assets/word.jpg)',
                    backgroundSize: '100% auto', // 가로를 100%로 맞추고, 세로는 비율에 맞게 조정
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
        >
            {/* 왼쪽 사인 이미지 */}
            <img 
                src="../src/assets/sign.png" 
                alt="Left Sign" 
                style={{ 
                    width: '240px', 
                    height: '240px', 
                    position: 'absolute', 
                    left: '64px', 
                    bottom: '192px', 
                    cursor: 'pointer',
                    transform: hovered === 'left' ? 'rotate(-10deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                }}
                onClick={handleSignClickLeft}
                onMouseEnter={() => handleMouseEnter('left')}
                onMouseLeave={handleMouseLeave}
            />

            {/* 오른쪽 사인 이미지 */}
            <img 
                src="../src/assets/sign.png" 
                alt="Right Sign" 
                style={{ 
                    width: '240px', 
                    height: '240px', 
                    position: 'absolute', 
                    right: '64px', 
                    bottom: '192px', 
                    cursor: 'pointer',
                    transform: hovered === 'right' ? 'rotate(10deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                }}
                onClick={handleSignClickRight}
                onMouseEnter={() => handleMouseEnter('right')}
                onMouseLeave={handleMouseLeave}
            />

            {/* 버튼들 */}
            <div className="absolute bottom-32 flex flex-col space-y-4 mb-4">
                <button 
                    className="border-2 border-black rounded-full px-8 py-2 text-lg"
                    onClick={toggleModal}
                >
                    게임방법
                </button>
                <button className="border-2 border-black rounded-full px-8 py-2 text-lg"
                        onClick={toggleRank}>이웃순위</button>
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
                        }}
                    >
                        {/* 닫기 버튼 */}
                        <button 
                            className="absolute top-4 right-4 px-4 py-2 bg-amber-700 text-white rounded-full"
                            onClick={toggleModal}
                        >
                            닫기
                        </button>

                        {/* 텍스트 콘텐츠 */}
                        <div className="text-center text-white">
                            <h2 className="text-2xl font-bold mb-4">게임방법</h2>
                            <p>이 게임은 주어진 단어로 새로운 단어를 이어가는 게임입니다. </p>
                            <p className="mt-2"><strong>예시:</strong> "사과" → "과일" → "일출"</p>
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
                        }}
                    >
                        {/* 닫기 버튼 */}
                        <button 
                            className="absolute top-4 right-4 px-4 py-2 bg-amber-700 text-white rounded-full"
                            onClick={toggleRank}
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
