import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NicknamePage() {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

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
                navigate('/'); // 설정 후 메인 페이지로 이동
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

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                닉네임 설정
            </Typography>
            <TextField
                label="닉네임"
                variant="outlined"
                fullWidth
                value={nickname}
                onChange={handleNicknameChange}
                error={Boolean(error)}
                helperText={error}
                style={{ marginBottom: '20px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                닉네임 저장
            </Button>
        </Container>
    );
}

export default NicknamePage;
