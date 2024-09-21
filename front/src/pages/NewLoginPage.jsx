import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useSetRecoilState } from 'recoil';
// import { loginState } from '../recoil/loginAtom';

function NewLoginPage() {
    const navigate = useNavigate();
    // const setIsValid = useSetRecoilState(loginState);

    // Google 로그인 함수
    const googleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    // 콜백 처리: URL에서 토큰 확인 후 상태 업데이트
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            // 토큰이 있는 경우: 로컬 스토리지에 저장하고 상태 업데이트
            localStorage.setItem('accessToken', token);
            // setIsValid(true); // 로그인 상태 업데이트
            navigate('/main'); // 메인 페이지로 이동
        }
    }, [navigate]);

    return (
        <div
            className="flex flex-col items-center justify-center relative h-screen"
            style={{
                width: '100%',
                height: '100vh',
                backgroundImage: 'url(../src/assets/images/login_bg.png)',
                backgroundSize: '100% auto', // 가로를 100%로 맞추고, 세로는 비율에 맞게 조정
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* 로그인 버튼 */}
            <div
                className="absolute top-56 flex flex-col space-y-4 mb-4"
                style={{ fontFamily: 'MyCustomFont, sans-serif', fontWeight: 'bold' }}
            >
                <button
                    className="border-solid border-2 border-black rounded-full bg-white px-8 py-3 text-2xl 
                    hover:bg-gray-200 transition duration-150"
                    onClick={googleLogin}
                >
                    구글 로그인
                </button>
            </div>
        </div>
    );
}

export default NewLoginPage;
