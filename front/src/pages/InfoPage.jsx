import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '../recoil/userAtom'; // 실제 경로에 맞게 설정
import { useNavigate, useLocation } from 'react-router-dom'; // React Router 관련
import Loading from './Loading'; // 실제 로딩 컴포넌트의 경로에 맞게 설정

const InfoPage = () => {
    const user = useRecoilValue(userAtom); // Recoil에서 사용자 정보를 가져옴
    const setUser = useSetRecoilState(userAtom); // 사용자 상태를 업데이트하기 위한 setter
    const navigate = useNavigate(); // 페이지 이동을 위한 React Router hook
    const location = useLocation(); // 현재 페이지 경로 감지
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [userScore, setUserScore] = useState(null); // 사용자의 점수 관리

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
    if (!user || loading) {
        return (
            <div style={{ maxWidth: '100vw', height: '100vh', margin: 'auto' }}>
                <div className="flex items-center justify-center h-full">
                    <Loading /> {/* 로딩 중일 때 로딩 컴포넌트 표시 */}
                </div>
            </div>
        );
    }

    // 사용자 정보를 화면에 렌더링
    return (
        <div className="flex items-center justify-center h-screen bg-blue-50"
             style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
            <div className="bg-white shadow-lg rounded-lg max-w-sm w-full p-6 text-center">
                <div className="flex flex-col items-center">
                    {/* 프로필 이미지 */}
                    <img
                        src={user.profileImage}
                        alt="Profile"
                        className="rounded-full w-24 h-24 border-4 border-blue-300"
                    />
                    
                    {/* 사용자 이메일 */}
                    <div className="mt-4">
                        <p className="text-gray-500">{user.email}</p>
                    </div>

                    {/* 사용자 점수 */}
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-gray-700">현재 누적 점수</h2>
                        <p className="text-2xl font-bold text-blue-600">
                            {/* {userScore !== null ? userScore : '점수를 불러오는 중입니다...'} */}
                            {userScore.userScore}
                        </p>
                    </div>

                    {/* 홈으로 돌아가기 버튼 */}
                    <div className="mt-6">
                        <button
                            onClick={() => navigate('/main')} // 홈으로 돌아가는 버튼
                            className="border-solid border-2 border-blue-50 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            홈으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
