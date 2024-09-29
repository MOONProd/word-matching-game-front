import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';

function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { gameResult } = location.state; // navigate로 전달된 gameResult
    console.log("제대로 나와~~", location.state);
    const user = useRecoilValue(userAtom); // Recoil에서 사용자 정보 가져오기

    const isWin = gameResult === 'You won'; // 승리 여부 확인
    const headerImage = isWin ? '/trophyGagul.png' : '/tearGagul.png'; // 승리 또는 패배 이미지
    const headerText = isWin ? 'You Win!' : 'You Lose...'; // 승리/패배 텍스트
    const headerTextColor = isWin ? 'text-green-500' : 'text-red-500'; // 승리/패배 텍스트 색상

    return (
        <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4 space-y-10"
             style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
            {/* Header 영역 */}
            <header className="mt-12 mb-12 flex items-center justify-center space-x-4 text-center">
                <img 
                    src={headerImage}
                    className='w-1/4 max-w-xs h-auto'
                    alt={isWin ? "Trophy Gagul" : "Lose Image"}
                />
                <h1 className={`text-5xl font-bold ${headerTextColor}`}>{headerText}</h1>
            </header>

            {/* 사용자 프로필 사진과 이름 */}
            <div className="flex items-center space-x-4 mb-4">
                <img
                    src={user.profileImage || "https://via.placeholder.com/150"}
                    alt="User Profile"
                    className={`w-24 h-24 rounded-full border-4 ${isWin ? 'border-green-300' : 'border-red-400'}`}
                />
                <h2 className="text-3xl font-semibold">{user.username}</h2>
            </div>

            {/* 사용자 점수 */}
            {isWin && (
                <div className="text-4xl text-yellow-500 font-bold">
                    +1점
                </div>
            )}
            <div className="text-2xl text-gray-700">
                총 점수: {isWin ? user.userScore + 1 : user.userScore}점
            </div>


            {/* 확인 버튼 */}
            <div className="mt-80">
                <button className="border-solid border-2 border-white rounded-full text-white
                    bg-blue-500 px-5 py-3 text-lg font-bold hover:bg-blue-400 transition duration-150"
                        onClick={() => navigate('/main')}>
                    확인
                </button>
            </div>
        </div>
    );
}

export default ResultPage;
