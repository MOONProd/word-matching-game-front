import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

const InfoPage = () => {
    const user = useRecoilValue(userAtom);
    const setUser = useSetRecoilState(userAtom); // 사용자 상태를 업데이트하기 위한 setter
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 서버에서 최신 사용자 데이터를 가져오는 함수
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/userinfo-here`); // 최신 사용자 정보 및 점수 가져오기
            const updatedUser = await response.json();

            // 최신 데이터를 Recoil 상태에 업데이트
            setUser((prevState) => ({
                ...prevState,
                userInformation: {
                    ...prevState.userInformation,
                    score: updatedUser.score, // 최신 점수로 업데이트
                    email: updatedUser.email, // 이메일 정보 업데이트
                    profileImage: updatedUser.profileImage, // 프로필 이미지 업데이트
                },
            }));

            console.log("나 업데이트 되는 중 ㅋㅋ",updatedUser.score);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    // InfoPage가 렌더링될 때 사용자 데이터를 가져옴
    useEffect(() => {
        fetchUserData();
    }, []);

    if (!user || loading) {
        return (
            <div style={{ maxWidth: '100vw', height: '100vh', margin: 'auto' }}>
                <div className="flex items-center justify-center h-full">
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-blue-50"
             style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
            <div className="bg-white shadow-lg rounded-lg max-w-sm w-full p-6 text-center">
                <div className="flex flex-col items-center">
                    {/* Profile Image */}
                    <img
                        src={user.profileImage}
                        alt="Profile"
                        className="rounded-full w-24 h-24 border-4 border-blue-300"
                    />
                    
                    {/* User Email */}
                    <div className="mt-4">
                        <p className="text-gray-500">{user.email}</p>
                    </div>

                    {/* User Score */}
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-gray-700">현재 누적 점수</h2>
                        <p className="text-2xl font-bold text-blue-600">{user.userScore}</p> {/* 최신 점수 표시 */}
                    </div>

                    {/* Navigation Button */}
                    <div className="mt-6">
                        <button
                            onClick={() => navigate('/main')}
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
