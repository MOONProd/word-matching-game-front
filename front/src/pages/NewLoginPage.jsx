import React from 'react';
import { useNavigate } from 'react-router-dom';

function NewLoginPage(props) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center relative h-screen"
                style={{
                    width: '100%',
                    height: '100vh',
                    backgroundImage: 'url(../src/assets/images/background.png)',
                    backgroundSize: '100% auto', // 가로를 100%로 맞추고, 세로는 비율에 맞게 조정
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
        >
            
            <div className="absolute top-28 flex flex-col mb-4"
                style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
                    <button 
                        className="border-2 border-black rounded-full px-8 py-3 text-2xl"
                        data-target="modal"
                        onClick={()=>{navigate('/login')}}
                    >
                        로그인
                    </button>
                </div>
        </div>
    );
}

export default NewLoginPage;