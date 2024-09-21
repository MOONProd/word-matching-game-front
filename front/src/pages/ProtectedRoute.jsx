import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/auth/user-info', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 401) {
                console.log('User is not authenticated. Redirecting to login.');
                navigate('/');
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                setUser(data);
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, [navigate]);

    if (!user) {
        return <div>Loading...</div>; // 로딩 상태
    }

    return (
        <div>
            <Outlet/> {/* 인증 성공 시 자식 라우트 렌더링 */}
        </div>
    );
};

export default ProtectedRoute;
