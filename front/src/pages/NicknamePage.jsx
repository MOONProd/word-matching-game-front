import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

function NicknamePage() {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const navigate = useNavigate();

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

    useEffect(() => {
        fetch('/auth/callback', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (response.status === 401) {
                    console.log('User is not authenticated. Redirecting to login.');
                    navigate('/');
                    return null; // Stop further processing
                }
                return response.json();
            })
            .then(data => {
                if (data) {
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

                    // Check the user status
                    if (data.status === 'noexist') {
                        console.log('User does not exist, redirecting to set nickname.');
                        // User does not have a nickname, stay on the nickname setting page
                        setLoading(false); // 로딩 완료
                    } else if (data.status === 'exist') {
                        console.log('User exists, redirecting to main page.');
                        navigate('/main'); // Redirect to main page if user already exists
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setLoading(false); // 로딩 완료
            });
    }, [navigate]);

    const handleSubmit = () => {
        if (nickname.trim() === '') {
            setError('닉네임을 입력해주세요.');
            return;
        }

        const data = { "nickname": nickname };
        fetch('/auth/set-nickname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    console.log('닉네임 설정 성공');
                    navigate('/main'); // 설정 후 메인 페이지로 이동
                } else {
                    console.error('닉네임 설정 실패');
                    setError('닉네임 설정에 실패했습니다.');
                }
            })
            .catch(error => {
                console.error('Error during nickname setting:', error);
                setError('서버와의 통신 중 오류가 발생했습니다.');
            });
    };

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
            return '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // 로딩 중일 때 표시할 컴포넌트
    if (loading) {
        return (
            <div style={{ maxWidth: '100vw', height: '100vh', margin: 'auto' }}>
                <div className="flex items-center justify-center h-full">
                    <Loading />
                </div>
            </div>
        );
    }

    // 로딩이 끝나고 나면 닉네임 설정 페이지 표시
    return (

        <div className="flex flex-col items-center justify-center h-screen p-4 bg-blue-200"
            style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
            <h2 className="text-2xl mb-6 font-bold">닉네임 설정</h2>
            <TextField
                label="닉네임"
                variant="outlined"
                value={nickname}
                onChange={handleNicknameChange}
                error={Boolean(error)}
                helperText={error}
                className='inputRounded w-64 mb-4' // Add some margin to the bottom
            />
            <button className='border-solid border-2 border-white rounded-full text-white mt-9
                    bg-blue-500 px-5 py-3 text-lg font-bold hover:bg-blue-400 transition duration-150'
                    onClick={handleSubmit}
            >
                닉네임 저장
            </button>
        </div>

    );
}

export default NicknamePage;
