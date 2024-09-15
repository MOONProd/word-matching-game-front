import React from 'react';
import '../assets/fonts/font.css';

function ResultPage() {
    const userName = "사용자 이름";
    const userProfilePic = "https://via.placeholder.com/150"; // 사용자 프로필 사진 예시 이미지 URL
    const userCurrentScore = 120; // 예시로 현재 유저 점수
    const pointsGained = 30; // 이번 게임에서 얻은 점수

    const loserName = "패배자 이름"; // 패배한 사용자 이름
    const loserProfilePic = "https://via.placeholder.com/100"; // 패배한 사용자 프로필 사진 예시 이미지 URL
    const loserCurrentScore = 110; // 예시로 패배한 유저 점수
    const pointsLost = 20; // 이번 게임에서 잃은 점수

    const newTotalScore = userCurrentScore + pointsGained;
    const loserNewTotalScore = loserCurrentScore - pointsLost;

    // 조건에 따라 이미지와 텍스트를 변경
    // const isWin = result === 'win'; //백에서 데이터 받아올 방법
    const isWin = true; //예시데이터
    const headerImage = isWin ? '../src/assets/trophyGagul.png' : '../src/assets/tearGagul.png';
    const headerText = isWin ? 'You Win!' : 'You Lose...';
    const headerTextColor = isWin ? 'text-green-500' : 'text-red-500';

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

            {/* 이긴 사용자 프로필 사진과 이름 */}
            <div className="flex items-center space-x-4 mb-4">
                <img
                    src={userProfilePic}
                    alt="User Profile"
                    className="w-24 h-24 rounded-full border-4 border-green-300"
                />
                <h2 className="text-3xl font-semibold">{userName}</h2>
            

            {/* +30점과 누적 점수 */}
            
                <div className="text-4xl text-yellow-500 font-bold">
                    +{pointsGained}점
                </div>
                <div className="text-2xl text-gray-700">
                    총 점수: {newTotalScore}점
                </div>
            </div>

            {/* 패배한 사용자 정보 */}
            <div className="flex items-center space-x-4 mb-4">
                <img
                    src={loserProfilePic}
                    alt="Loser Profile"
                    className="w-16 h-16 rounded-full border-4 border-red-300"
                />
                <h2 className="text-2xl font-semibold text-red-500">{loserName}</h2>
            

            {/* -20점과 패배자의 누적 점수 */}
            
                <div className="text-3xl text-red-500 font-bold">
                    -{pointsLost}점
                </div>
                <div className="text-xl text-gray-700">
                    총 점수: {loserNewTotalScore}점
                </div>
            </div>

            {/* 확인 버튼 */}
            <div className="mt-80">
                <button className="bg-green-500 text-white px-6 py-3 rounded-full text-xl">
                    확인
                </button>
            </div>
        </div>
    );
}

export default ResultPage;
