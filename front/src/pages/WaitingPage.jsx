import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function WaitingPage() {
    const [isReady, setIsReady] = useState(false); // 데이터를 기다리는 상태
    const navigate = useNavigate();

    // 데이터를 체크하는 비동기 함수 (백엔드 호출을 시뮬레이션)
    const checkData = async () => {
        try {
            // 백엔드에서 데이터를 가져오는 API 호출을 시뮬레이션 (예시로 setTimeout 사용)
            setTimeout(() => {
                // 실제로는 백엔드 API 호출 후 response를 통해 상태를 설정합니다.
                const response = { ready: true }; // 예시 데이터
                if (response.ready) {
                    setIsReady(true);
                }
            }, 2000); // 2초 후에 ready: true 데이터가 온다고 가정
        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        }
    };

    // 컴포넌트가 마운트될 때 데이터를 계속 체크하는 함수 실행
    useEffect(() => {
        checkData(); // 초기 데이터 체크

        // 주기적으로 데이터를 체크 (1초마다)
        const interval = setInterval(checkData, 1000);

        // 컴포넌트가 언마운트될 때 인터벌을 정리
        return () => clearInterval(interval);
    }, []);

    // isReady 상태가 true로 변경되면 /chat 페이지로 리디렉션
    useEffect(() => {
        if (isReady) {
            navigate('/chat');
        }
    }, [isReady, navigate]); // isReady 또는 navigate 변경 시 실행

    return (
        <div>
            대기 중 ...
        </div>
    );
}

export default WaitingPage;
