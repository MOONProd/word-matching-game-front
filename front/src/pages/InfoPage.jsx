// src/pages/InfoPage.jsx

import React from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

const InfoPage = () => {
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    if (!user) {
        return <div><Loading /></div>;
    }

    return (
        <div className="flex items-center justify-center h-screen bg-blue-50"
             style={{ fontFamily: 'MyCustomFont, sans-serif'}}>
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
                        <p className="text-2xl font-bold text-blue-600">{user.userScore}</p>
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
