// src/components/WaitingPage.js

import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import TextField from '@mui/material/TextField';
import { useParams, useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { useChat } from './ChatLogic';

export const WaitingPage = () => {
    const user = useRecoilValue(userAtom);

    const { roomId } = useParams();

    const { messages: chatMessages, sendMessage: sendChatMessage, connectedChatUsers } = useChat(); // 전체 채팅 관련 useChat 훅 사용
    const navigate = useNavigate(); // Hook for navigation

    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [otherUserIsReady, setOtherUserIsReady] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentTurn, setCurrentTurn] = useState(null); // Will hold userId of the current turn
    const [otherUserId, setOtherUserId] = useState(null);
    const [gameOver, setGameOver] = useState(false); // New state variable
    const [gameResult, setGameResult] = useState(''); // To store 'You won' or 'You lose'

    const [chatContent,setChatContent] = useState('');
    const [systemMessageDisplayed, setSystemMessageDisplayed] = useState(false);

    const [connectedUsers, setConnectedUsers] = useState([]);

    const [showLeftSidebar, setShowLeftSidebar] = useState(true);
    const [showFooter, setShowFooter] = useState(true);
    const [showHeader, setShowHeader] = useState(true);
    const [showCentralChat, setShowCentralChat] = useState(false);
    const [showStartIcon, setShowStartIcon] = useState(false);

    const [timeProgress, setTimeProgress] = useState(0); // 타이머 진행 상태
    const [isTimerActive, setIsTimerActive] = useState(false); // 타이머 활성화 상태
    const timerRef = useRef(null); // 타이머 참조

    const stompClientRef = useRef(null);
    const roomIdRef = useRef(roomId);

    // Ensure user IDs are numbers
    const userId = Number(user.userInformation.id);
    const roomHostId = Number(roomId);

    const isHost = userId === roomHostId;
    const chatEndRef = useRef(null); // 전체 채팅 스크롤을 위한 ref 추가
    const roomChatEndRef = useRef(null); // 방 채팅 스크롤을 위한 ref 추가

    // State for ChatModal
    // const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    const [label, setLabel] = useState('메시지를 입력하세요');

    useEffect(() => {
        roomIdRef.current = roomId;
    }, [roomId]);

    useEffect(() => {
        if (user && user.username && roomId && !stompClientRef.current && userId != null) {
            connectWebSocket(user.username, userId, roomId);
            updateEnteredPlayerId(userId, roomId);
        }
    }, [user, roomId, userId]);

    useEffect(() => {
        return () => {
            handleUserLeave(roomIdRef.current);
        };
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            handleUserLeave(roomIdRef.current);
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    useEffect(() => {
        // 방 채팅 메시지가 업데이트될 때마다 스크롤을 최신 메시지로 이동
        if (roomChatEndRef.current) {
            roomChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (isReady && otherUserIsReady) {
            setTimeout(() => {
                setShowLeftSidebar(false); // 왼쪽 영역 사라짐
            }, 1000);

            setTimeout(() => {
                setShowFooter(false); // 푸터 사라짐
            }, 2000);

            setTimeout(() => {
                setShowHeader(false); // 헤더 사라짐
            }, 3000);

            setTimeout(() => {
                setShowCentralChat(true); // 개인 채팅방 중앙에 고정
                setIsGameStarted(true); // 게임 시작 상태 설정
                setShowStartIcon(true); // 게임 시작 아이콘 표시
                setTimeout(() => setShowStartIcon(false), 1000); // 1초 후 게임 시작 아이콘 숨김
            }, 4000);
        }
    }, [isReady, otherUserIsReady]);

    // 타이머 초기화 및 관리
    useEffect(() => {
        if (currentTurn === userId && isGameStarted) {
            setIsTimerActive(true);
            timerRef.current = setInterval(() => {
                setTimeProgress((prev) => {
                    if (prev < 100) {
                        return prev + 2; // 5초 동안 타임바가 0에서 100까지 증가
                    } else {
                        clearInterval(timerRef.current);
                        setIsTimerActive(false);
                            let overMessage = {
                                senderName: "user.username",
                                message: "TIMEOUT",
                                status: 'GAME_IS_OFF',
                                userId: userId,
                            };
                            stompClientRef.current.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
                            setMessageContent('');
                        // 여기에 턴 넘기기 로직 추가
                        return 0;
                    }
                });
            }, 100); // 0.1초마다 업데이트
        } else {
            clearInterval(timerRef.current);
            setTimeProgress(0);
            setIsTimerActive(false);
        }

        return () => clearInterval(timerRef.current); // 컴포넌트 언마운트 시 타이머 정리
    }, [currentTurn, userId, isGameStarted]);


    // 게임 종료 시 navigate로 이동
    useEffect(() => {
        const handleGameOver = async () => {
            if (gameOver && gameResult) { // gameResult가 빈 값이 아닌 경우에만 navigate 호출
                try {
                    if (gameResult === 'You won') {
                        console.log('Score Update 완료');
                    }
                } catch (error) {
                    console.error('Error updating score:', error);
                }

                // 게임 결과와 사용자 정보를 result 페이지로 전달
                navigate('/result', {
                    state: {
                        gameResult: gameResult, // 'You won' or 'You lose'
                        userId: userId,
                        opponentId: otherUserId, // 상대방 ID
                    }
                });
            }
        };

        handleGameOver();
    }, [gameOver, gameResult, userId, otherUserId, navigate]);


    const connectWebSocket = (username, userId, roomId) => {
        let Sock = new SockJS('/ws');
        const client = over(Sock);
        stompClientRef.current = client;

        const headers = {
            username: username,
            roomId: roomId,
        };

        client.connect(headers, () => onConnected(username, userId, roomId), onError);
    };

    const onConnected = (username, userId, roomId) => {
        setConnected(true);

        stompClientRef.current.subscribe(`/room/${roomId}/public`, onMessageReceived);

        let joinMessage = {
            senderName: username,
            status: 'JOIN',
            userId: userId,
        };
        stompClientRef.current.send(`/app/room/${roomId}/message`, {}, JSON.stringify(joinMessage));
    };

    const onMessageReceived = (payload) => {
        try {
            let payloadData = JSON.parse(payload.body);
            console.log('Received message:', payloadData);

            if (payloadData.status === 'USER_LIST') {
                // 접속자 목록 처리 로직 (필요 시 사용)
                const uniqueUsers = Array.from(new Set(payloadData.userList));
                setConnectedUsers(uniqueUsers);
            } else if (payloadData.status === 'READY' || payloadData.status === 'NOT_READY') {
                // READY/NOT_READY 상태 처리
                const senderUserId = Number(payloadData.userId);
                const isSenderReady = payloadData.status === 'READY';

                if (senderUserId !== userId) {
                    setOtherUserIsReady(isSenderReady);
                    setOtherUserId(senderUserId);
                    console.log('Set otherUserIsReady:', isSenderReady);
                } else {
                    setIsReady(isSenderReady);
                    console.log('Set isReady:', isSenderReady);
                }
            } else if (payloadData.status === 'JOIN') {
                setMessages((prevMessages) => [...prevMessages, payloadData]);
                const joinedUserId = Number(payloadData.userId);
                if (joinedUserId !== userId) {
                    setOtherUserId(joinedUserId);
                    console.log('Set otherUserId (JOIN):', joinedUserId);
                }
            } else if (payloadData.status === 'LEAVE') {
                setMessages((prevMessages) => [...prevMessages, payloadData]);
                if (payloadData.userId !== userId) {
                    setOtherUserIsReady(false);
                    setOtherUserId(null);
                    setIsReady(false);
                    updateReadyStatusOnServer(false);
                }
                if (payloadData.userId === userId) {
                    setIsReady(false);
                }
            } else if (payloadData.status === 'GAME_IS_ON') {
                // 시스템 메시지인 경우 4초 뒤에 표시, 나머지 메시지는 즉시 처리
                if (payloadData.senderName === 'System' && !systemMessageDisplayed) {
                    // 4초 후 시스템 메시지 표시
                    setTimeout(() => {
                        setMessages((prevMessages) => [...prevMessages, payloadData]);
                        setSystemMessageDisplayed(true); // 한 번만 표시
                    }, 4000);
                } else {
                    // 시스템 메시지가 아닌 경우(사용자 메시지)는 즉시 처리
                    setMessages((prevMessages) => [...prevMessages, payloadData]);
                }

                if (!gameStarted) {
                    // 게임 시작 처리
                    setGameStarted(true);

                    // Set the initial turn based on the userId provided in the message
                    const startingUserId = Number(payloadData.userId);
                    setCurrentTurn(startingUserId);
                    console.log('Game started. Current turn set to userId:', startingUserId);
                }
            } else if (payloadData.status === 'TURN_CHANGE') {
                // 턴 변경 처리
                setCurrentTurn(payloadData.userId);
                console.log('Turn changed. Current turn set to userId:', payloadData.userId);
            } else if (payloadData.status === 'GAME_IS_OFF') {
                // 게임 종료 처리
                if (Number(payloadData.userId) === userId) {
                    setGameResult(payloadData.message); // Set game result
                    console.log('Your result:', payloadData.message);
                    if (payloadData.message === 'You won') {
                        // 승자 점수 업데이트
                        updateWinnerScore();
                    }
                } // WaitingPage.js에서 navigate 호출 부분 수정
                else if (Number(payloadData.userId) === 999) {
                    navigate('/main', { state: { fromGameEnd: true } });
                }
                
                setGameStarted(false); // 게임 상태 초기화
                setCurrentTurn(null);
                setGameOver(true); // 게임 종료 상태 설정
                setMessages((prevMessages) => [...prevMessages, payloadData]);
            } else if (payloadData.status === 'DUPLICATED') {
                // Handle duplicated word
                setMessages((prevMessages) => [...prevMessages, payloadData]);
                // Assuming the server sends GAME_IS_OFF after DUPLICATED, so gameOver and gameResult will be handled there
            } else if (payloadData.status === 'ERROR') {
                // 에러 처리
                if (Number(payloadData.userId) === userId) {
                    // 에러 메시지 처리 (Optional: Display error to user)
                    // You can add error handling logic here if needed
                }
            } else {
                // 일반 메시지 처리
                setMessages((prevMessages) => [...prevMessages, payloadData]);
            }

            // Ensure otherUserId is set whenever we receive a message from the other user
            if (
                payloadData.userId &&
                Number(payloadData.userId) !== userId &&
                Number(payloadData.userId) !== otherUserId
            ) {
                setOtherUserId(Number(payloadData.userId));
            }

        } catch (error) {
            console.error('Message Parsing Error: ', error, payload.body);
        }
    };




    const sendMessage = () => {
        if (stompClientRef.current && connected) {
            if(messageContent.trim() !== ''){

                let chatMessage = {
                    senderName: user.username,
                    message: messageContent,
                    status: 'GAME_IS_ON',
                    userId: userId,
                };
                stompClientRef.current.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
                setMessageContent('');
            }
        }
    };

    const handleSendMessage = () => {
        if (chatContent.trim() !== '') {
            sendChatMessage(chatContent);
            setChatContent('');
        }
    };

    const handleMessageChange = (event) => {
        setMessageContent(event.target.value);
    };

    // const handleChatContentChange = (event) => {
    //     setChatContent(event.target.value);
    // };

    const handleFocus = () => {
        setLabel('메시지를 입력중...');
    };

    const handleBlur = () => {
        setLabel(chatContent === '' ? '메시지를 입력하세요' : '메시지가 입력되었습니다.');
    };

    const handleUserLeave = (roomId) => {
        console.log('User leaving room:', roomId);

        // Update room status on leave
        updateEnteredPlayerId(0, roomId);

        // Reset local readiness and update server
        setIsReady(false);
        updateReadyStatusOnServer(false);

        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.disconnect(() => console.log('Disconnected from WebSocket'));
            stompClientRef.current = null;
            setConnected(false);
        }
    };

    const onError = (error) => {
        console.error('WebSocket Error:', error);
    };

    const updateEnteredPlayerId = async (enteredPlayerId, roomId) => {
        try {
            const response = await fetch(`/api/room/${roomId}/enter?enteredPlayerId=${enteredPlayerId}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.text();
                console.log('Room status updated successfully:', data);
            } else {
                console.error('Error updating room status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating room status:', error);
        }
    };

    const updateReadyStatusOnServer = async (readyStatus) => {
        try {
            const hostId = roomHostId;
            const requestBody = {
                userId: userId,
                forceReadyStatus: readyStatus,
            };

            const response = await fetch(`/api/room/${hostId}/ready`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.text();
                console.log('Ready status updated successfully:', data);
                // The server will broadcast the readiness status
            } else {
                console.error('Error updating ready status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating ready status:', error);
        }
    };

    const handleReadyClick = async () => {
        try {
            const hostId = roomHostId;
            const requestBody = {
                userId: userId,
            };

            const response = await fetch(`/api/room/${hostId}/ready`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.text();
                console.log('Ready status updated successfully:', data);
                // The server will broadcast the readiness status
            } else {
                console.error('Error updating ready status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating ready status:', error);
        }
    };

    const updateWinnerScore = async () => {
        try {
            const response = await fetch('/api/score/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId }),
            });

            if (response.ok) {
                console.log('Score updated successfully');
            } else {
                console.error('Error updating score:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating score:', error);
        }
    };

    const isInputDisabled = currentTurn !== userId;

    return (
        <div className={`bg-blue-50 flex flex-col h-screen transition-all duration-1000 ${isGameStarted ? 'bg-blue-300' : ''}`}>
            {/* Header Area */}
            <div className={`flex justify-between items-center p-4 bg-blue-200 transition-all duration-1000 ${showHeader ? '' : '-translate-y-full opacity-0'}`}
                 style={{ fontFamily: 'MyCustomFont, sans-serif', height: '10%', transition: 'all 1s ease-in-out',
                     display: showCentralChat ? 'none' : '',
                 }}
            >
                <h2 className="text-xl font-bold">플레이어 준비 상태</h2>
                <div className="flex space-x-4">
                <span className="text-black">
                    You
                    <span className={isReady ? 'text-green-700 ml-1 font-bold' : 'text-red-500 ml-1 font-bold'}>
                        {isReady ? '준비 완료' : '준비 대기'}
                    </span>
                </span>
                    <span className="text-black">
                    Other
                    <span className={otherUserIsReady ? 'text-green-700 ml-1 font-bold' : 'text-red-500 ml-1 font-bold'}>
                        {otherUserIsReady ? '준비 완료' : '준비 대기'}
                    </span>
                </span>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className={`flex flex-grow overflow-hidden bg-blue-50 shadow`}>
                {/* Left Side: Connected Users & Global Chat */}
                <div className={`w-1/4 bg-white p-4 border-r border-gray-200 flex flex-col justify-between transition-all duration-1000 ${showLeftSidebar ? '' : '-translate-x-full opacity-0'}`}>
                    <div>
                        <h3 className="text-lg font-bold mb-4"
                            style={{ fontFamily: 'MyCustomFont, sans-serif' }}>접속자 목록</h3>
                        <ul>
                            {connectedUsers.map((username, index) => (
                                <li key={index} className="mb-2">{username}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4"
                            style={{ fontFamily: 'MyCustomFont, sans-serif' }}>전체 채팅</h3>
                        <div className='bg-blue-400 bg-opacity-60
                                        text-white rounded-lg p-2'>
                            <div className="overflow-y-auto h-40 mb-4">
                                <ul className="list-none p-0">
                                    {chatMessages.map((item, index) => (
                                        <li key={index} className="mb-2">
                                            {item.status === 'JOIN' || item.status === 'LEAVE' ? (
                                                <strong>{`${item.senderName}님이 ${item.status === 'JOIN' ? '들어왔습니다.' : '나갔습니다.'}`}</strong>
                                            ) : (
                                                <>
                                                    <strong>{item.senderName}:</strong> {item.message}
                                                </>
                                            ) }
                                        </li>
                                    ))}
                                    <div ref={chatEndRef} /> {/* 자동 스크롤을 위한 Ref */}
                                </ul>
                            </div>
                            <div className="flex">
                                <TextField
                                    id="standard-chat"
                                    label={label}
                                    variant="standard"
                                    value={chatContent}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    onChange={(e) => setChatContent(e.target.value)}
                                    className="flex-grow text-white"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        sendChatMessage(chatContent);
                                        setChatContent('');
                                    }} className="px-4 py-2 border-l-2 border-white">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Room-specific chat */}
                <div className={`flex flex-col flex-grow overflow-hidden p-5 transition-all duration-1000 ${showCentralChat ? 'fixed inset-0 justify-center' : ''}`}
                     style={showCentralChat ? {
                         marginLeft: '300px', // 왼쪽 이미지 공간 확보
                         marginRight: '300px', // 오른쪽 이미지 공간 확보
                         maxHeight: 'calc(100vh - 20px)' // 전체 화면 높이에서 여유를 두고 최대 높이 설정
                     } : { maxHeight: 'calc(100vh - 20px)' }} // 기본 상태에서도 최대 높이 설정
                >

                    <div className="flex-grow overflow-y-auto mb-2">
                        <ul className="list-none p-0">
                            {messages.map((item, index) => (
                                <li
                                    key={index}
                                    className={`flex ${
                                        item.senderName === user.username ? 'justify-end' : 'justify-start'
                                    } mb-2`}
                                >
                                    <div
                                        className={`px-4 py-2 rounded-xl ${
                                            item.senderName === user.username ? 'bg-green-100' : 'bg-gray-200'
                                        } max-w-lg break-words`}
                                    >
                                        {item.status === 'JOIN' || item.status === 'LEAVE' ? (
                                            <strong>{`${item.senderName}님이 ${
                                                item.status === 'JOIN' ? '들어왔습니다.' : '나갔습니다.'
                                            }`}</strong>
                                        ) : (
                                            <>
                                                <strong>{item.senderName === user.username ? '나' : item.senderName}:</strong>{' '}
                                                {item.message}
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                            <div ref={roomChatEndRef} /> {/* 자동 스크롤을 위한 Ref */}
                        </ul>
                    </div>
                    {isTimerActive && (
                        <div className="w-full bg-gray-300 h-1 relative">
                            <div 
                                className="bg-blue-500 h-1 absolute left-0 bottom-0 transition-all duration-100" 
                                style={{ width: `${timeProgress}%` }}
                            />
                        </div>
                    )}
                    <div className="flex items-center w-full max-w-full"
                         style={{display: showCentralChat ? '' : 'none'}}>
                        <TextField
                            id="standard-basic"
                            variant="standard"
                            value={messageContent}
                            onChange={handleMessageChange}
                            className="flex-grow mx-4"
                            label={
                                isInputDisabled
                                    ? '상대방의 차례입니다.'
                                    : '메시지를 입력하세요'
                            }
                            disabled={isInputDisabled}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            className="px-4 py-2 border-l-2 border-white"
                            disabled={isInputDisabled}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Area */}
            <div className={`flex justify-center items-center p-4 bg-blue-100 transition-all duration-1000 ${showFooter ? '' : 'translate-y-full opacity-0'}`}
                 style={{ fontFamily: 'MyCustomFont, sans-serif', height: '10%',
                     display: showCentralChat ? 'none' : '',
                 }}>
                {!gameStarted &&
                    <button
                        className={`border-solid border-2 border-white rounded-full text-white 
                                    ${(connectedUsers.length < 2) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-400'} 
                                    px-5 py-3 text-lg font-bold transition duration-150`}
                        onClick={handleReadyClick}
                        disabled={connectedUsers.length < 2}
                    >
                        {isReady ? '준비 취소' : '준비!!!!'}
                    </button>
                }
            </div>




            {/* 게임 시작 아이콘 */}
            {showStartIcon && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <img src="/gameStart.png"
                         style={{ width: '350px', height: 'auto' }}/>
                </div>
            )}

            {/* 양쪽에서 이미지가 들어오는 애니메이션 */}
            {isGameStarted && (
                <>
                    <div className='absolute left-10 bottom-1/3 transform translate-y-1/2 animate-slideInLeft'>
                        <img src="/cheerGagul.png"
                             className="animate-rotate-wiper-left"
                             style={{ width: '250px', height: 'auto' }} />
                    </div>
                    <div className='absolute right-10 bottom-1/3 transform translate-y-1/2 animate-slideInRight'>
                        <img src="/cheerGagul.png"
                             className="animate-rotate-wiper-right"
                             style={{ width: '250px', height: 'auto' }} />
                    </div>
                </>
            )}
        </div>
    );
};
