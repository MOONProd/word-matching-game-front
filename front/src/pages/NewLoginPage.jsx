import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NewLoginPage() {
    const navigate = useNavigate();

    // Google 로그인 함수 (팝업 창 열기)
    const googleLogin = () => {
        // 팝업 창 열기
        const popup = window.open(
            'http://localhost:8080/oauth2/authorization/google',
            'googleLoginPopup',
            'width=500,height=600'
        );

        if (popup) {
            // 팝업 창이 열렸을 때 메시지 수신 대기
            const messageListener = (event) => {
                // 팝업 창에서 보낸 메시지 수신
                if (event.origin === 'http://localhost:8080') { // 백엔드 주소와 동일하게 설정
                    const { token, status } = event.data; // 팝업에서 전달된 토큰과 상태
            
                    if (token) {
                        // 토큰을 로컬 스토리지에 저장
                        localStorage.setItem('accessToken', token);
            
                        // 상태에 따른 처리
                        if (status === 'noexist') {
                            // 닉네임이 없는 경우 NicknamePage로 이동
                            navigate('/login/done');
                        } else if (status === 'exist') {
                            // 닉네임이 있는 경우 메인 페이지로 이동
                            navigate('/main');
                        }
                    }
                }
            };            

            // 메시지 이벤트 리스너 등록
            window.addEventListener('message', messageListener);

            // 팝업 창이 닫혔을 때 메시지 리스너 제거
            const popupInterval = setInterval(() => {
                if (popup.closed) {
                    clearInterval(popupInterval);
                    window.removeEventListener('message', messageListener);
                }
            }, 500);
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center relative h-screen"
            style={{
                width: '100%',
                height: '100vh',
                backgroundImage: 'url(../src/assets/images/login_bg.png)',
                backgroundSize: '100% auto',
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
