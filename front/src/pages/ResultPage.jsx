import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import Loading from './Loading';

function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [userScore, setUserScore] = useState(null); // 사용자의 점수 관리
    const [loading, setLoading] = useState(true); // 로딩 상태 관리

    const { gameResult } = location.state; // navigate로 전달된 gameResult
    console.log("제대로 나와~~", location.state);
    const user = useRecoilValue(userAtom); // Recoil에서 사용자 정보 가져오기
    const setUser = useSetRecoilState(userAtom); // 사용자 상태를 업데이트하기 위한 setter

    const isWin = gameResult === 'You won'; // 승리 여부 확인
    const headerImage = isWin ? '/trophyGagul.png' : '/tearGagul.png'; // 승리 또는 패배 이미지
    const headerText = isWin ? 'You Win!' : 'You Lose...'; // 승리/패배 텍스트
    const headerTextColor = isWin ? 'text-green-500' : 'text-red-500'; // 승리/패배 텍스트 색상
    

    // 서버에서 최신 사용자 데이터를 가져오는 함수
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/userinfo-here`); // 서버로부터 사용자 정보 및 점수 가져오기
            if (!response.ok) {
                throw new Error('Failed to fetch user data'); // 실패 시 에러 발생
            }

            const updatedUser = await response.json();

            // 최신 데이터를 Recoil 상태에 업데이트
            setUser((prevState) => ({
                ...prevState,
                userInformation: {
                    ...prevState.userInformation,
                    email: updatedUser.email, // 이메일 정보 업데이트
                    profileImage: updatedUser.profileImage, // 프로필 이미지 업데이트
                },
            }));

            // 점수 상태 업데이트
            setUserScore(updatedUser.score); // 최신 점수로 업데이트
            console.log("User score fetched:", updatedUser.score);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false); // 데이터를 가져온 후 로딩 상태 해제
        }
    };

       // InfoPage가 렌더링될 때마다 사용자 데이터를 가져옴
       useEffect(() => {
        fetchUserData(); // location.pathname이 바뀔 때마다 실행
    }, [location.pathname]); // 페이지 이동을 감지하여 fetchUserData를 다시 호출

     // 사용자가 없거나 로딩 중일 때 로딩 화면 표시
     if (loading) {
        return (
            <div style={{ maxWidth: '100vw', height: '100vh', margin: 'auto' }}>
                <div className="flex items-center justify-center h-full">
                    <Loading /> {/* 로딩 중일 때 로딩 컴포넌트 표시 */}
                </div>
            </div>
        );
    }

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
                총 점수: {userScore.userScore}점
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
