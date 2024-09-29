import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';

const Loading = () => {
  const [visibleChars, setVisibleChars] = useState(9); // 현재 보여줄 글자의 수를 관리
  const loadingText = '로딩중...'; // 표시할 로딩 텍스트
  const [reset, setReset] = useState(false); // 글자가 모두 나타나고 초기화할지 여부

  useEffect(() => {
    let timeout;

    if (!reset) {
      // 글자를 하나씩 누적해서 보여주는 로직
      timeout = setTimeout(() => {
        setVisibleChars((prev) => {
          if (prev < loadingText.length) {
            return prev + 1; // 다음 글자를 보여줌
          } else {
            setReset(true); // 모든 글자가 다 나타나면 reset 모드로 전환
            return prev;
          }
        });
      }, 300); // 글자 하나씩 나타나는 시간 설정
    } else {
      // 모든 글자가 나타난 후 reset 로직
      timeout = setTimeout(() => {
        setVisibleChars(0); // 글자를 모두 지우고
        setReset(false); // 다시 시작하도록 설정
      }, 1000); // reset 유지 시간 설정
    }

    return () => clearTimeout(timeout);
  }, [visibleChars, reset, loadingText.length]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        backgroundImage: 'url(../src/assets/images/loadingbg.png)', // 배경 이미지 경로 설정
        backgroundSize: 'cover', // 배경 이미지 크기 설정 (cover로 설정하면 전체를 채움)
        backgroundPosition: 'center', // 배경 이미지 위치
      }}
    >
      <div style={{ fontFamily: 'MyCustomFont, sans-serif', display: 'flex' }}>
        {loadingText.split('').map((char, index) => (
          <Grow
            key={index}
            in={index < visibleChars} // visibleChars 수에 따라 글자를 보여줌
            style={{ transformOrigin: 'center center',fontFamily: 'MyCustomFont, sans-serif', fontWeight: 'bold' }}
            {...(index < visibleChars ? { timeout: 500 } : {})} // timeout을 설정하여 애니메이션 속도를 조절
          >
            <Typography variant="h4" component="div" sx={{ margin: '0 5px', fontWeight: 'bold', color: 'black' }}>
              {char}
            </Typography>
          </Grow>
        ))}
      </div>
    </Box>
  );
};

export default Loading;
