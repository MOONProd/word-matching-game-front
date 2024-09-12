import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const startGame = () => {
        navigate('/secondPlay');
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="relative flex flex-col items-center mb-20">
                <svg width="400" height="200" viewBox="0 0 400 200">
                    <defs>
                        <path
                            id="curve"
                            d="M 65,120
                               A 200,200 0 0,1 340,120"
                            fill="transparent"
                        />
                    </defs>
                    <text width="400">
                        <textPath
                            href="#curve"
                            startOffset="50%"
                            textAnchor="middle"
                            fontSize="36"
                            fontWeight="bold"
                            dominantBaseline="middle"
                        >
                            WORD BRIDGE
                        </textPath>
                    </text>
                </svg>
            </div>
            <div className="flex flex-col space-y-4">
                <button 
                    className="border-2 border-black rounded-full px-8 py-2 text-lg"
                    onClick={toggleModal}
                >
                    게임방법
                </button>
                <button className="border-2 border-black rounded-full px-8 py-2 text-lg"
                        onClick={startGame}>게임시작</button>
            </div>

            {/* 모달 창 */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">게임방법</h2>
                        <p>이 게임은 주어진 단어로 새로운 단어를 이어가는 게임입니다. </p>
                        <p className="mt-2"><strong>예시:</strong> "사과" → "과일" → "일출"</p>
                        <button 
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full"
                            onClick={toggleModal}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainPage;
