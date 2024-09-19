import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Test(props) {
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
                    navigate('/login');
                    return null; // Stop further processing
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setUser(data);

                    // Store tokens in localStorage
                    if (data.accessToken) {
                        localStorage.setItem('accessToken', data.accessToken);
                        console.log('Access token stored in localStorage.');
                    } else {
                        console.warn('No access token received from server.');
                    }

                    if (data.refreshToken) {
                        localStorage.setItem('refreshToken', data.refreshToken);
                        console.log('Refresh token stored in localStorage.');
                    } else {
                        console.warn('No refresh token received from server.');
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [navigate]);

    const handleNavigate = () => {
        navigate('/login/dummy');
    };

    return (
        <div>
            <div><h1>오....?</h1></div>
            {user ? (
                <div>
                    <h1>흠..... 자네의 이름은 {user.name}이고</h1>
                    <h1>이메일은 {user.email}이구먼 으헤헿ㅎ</h1>
                    <button onClick={handleNavigate}>Go to TestTwo</button>
                </div>
            ) : (
                <h1>뭔가 보인다....!</h1>
            )}
        </div>
    );
}

export default Test;
