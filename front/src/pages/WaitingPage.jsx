import React, { useEffect, useState, useRef } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { userPresenceAtom } from '../recoil/userPresenseAtom.jsx';
import { stompClientAtom } from '../recoil/stompclientAtom.jsx';

let stompClient = null;

export const WaitingPage = () => {
    const [publicChats, setPublicChats] = useState([]);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [tab, setTab] = useState('CHATROOM');
    const [userData, setUserData] = useState({
        receiverName: '',
        connected: false,
        message: '',
    });

    const [timeProgress, setTimeProgress] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false)

    const [roomStatus, setRoomStatus] = useState({
        hostReady: false,
        visitorReady: false,
    });
    
    const timerRef = useRef(null); // 타이머 참조 변수

    const user = useRecoilValue(userAtom);
    const [userPresence, setUserPresence] = useRecoilState(userPresenceAtom);
    const navigate = useNavigate();
    const { roomId } = useParams(); // Get roomId from URL
    const location = useLocation(); // Get additional state (e.g., isHost)
    const isHost = location.state?.isHost || false; // Determine if the user is the host

    // Effect to handle WebSocket connection
    useEffect(() => {
        if (user && user.username && roomId) {
            // Initiate WebSocket connection
            registerUser(user.username);
            setUserPresence((prev) => ({ ...prev, roomId: roomId }));

            if (!isHost) {
                // If the user is a visitor, update room_status_info when entering the room
                updateEnteredPlayerId(roomId, user.userInformation.id);
            }
        } else {
            // If user data is not available, navigate to login or handle accordingly
            navigate('/main');
        }

        // Handle browser refresh or closing the tab
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = ''; // This prompts the user with the default browser message on page unload
            handleUserLeave();
            alert("다시들어오렴");
            navigate('/');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Handle back button navigation or any route change
        const handlePopState = () => {
            if (window.confirm('Are you sure you want to leave?')) {
                handleUserLeave();
                navigate('/firstPlay'); // Navigate to firstPlay if the user confirms to leave
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Clean up listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [user, navigate, roomId]);

    // 타이머 관리
    useEffect(() => {
        if (isTimerActive) {
            timerRef.current = setInterval(() => {
                setTimeProgress((prev) => {
                    if (prev < 100) {
                        return prev + 2; // 5초 동안 0에서 100까지 증가
                    } else {
                        clearInterval(timerRef.current);
                        alert('시간 종료!');
                        setIsTimerActive(false);
                        return 0;
                    }
                });
            }, 100);

            return () => clearInterval(timerRef.current);
        }
    }, [isTimerActive]);

    // Handle WebSocket connection
    const registerUser = (username) => {
        console.log('Registering user:', username);
        let Sock = new SockJS('/ws');
        stompClient = over(Sock);
        stompClient.connect({}, () => onConnected(username), onError);
    };

    // Handle successful connection
    const onConnected = (username) => {
        console.log('Connected to WebSocket as:', username);
        setUserData((prevData) => ({ ...prevData, connected: true }));

        // Subscribe to the room's public chat
        stompClient.subscribe(`/room/${roomId}/public`, onPublicMessageReceived);

        // Subscribe to private messages
        stompClient.subscribe(`/user/${username}/private`, onPrivateMessageReceived);

        // Notify that user has joined the room
        userJoin(username);
    };

    // Send join message to the room's public channel
    const userJoin = (username) => {
        let chatMessage = {
            senderName: username,
            status: 'JOIN',
        };
        stompClient.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
    };

    // Handle user leave
    const handleUserLeave = () => {
        console.log('User leaving');
        if (stompClient && stompClient.connected) {
            let chatMessage = {
                senderName: user.username,
                status: 'LEAVE',
            };
            stompClient.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
            stompClient.disconnect(() => console.log('Disconnected from WebSocket'));
        }
    };

    // Handle public and private messages
    const onPublicMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case 'JOIN':
                if (payloadData.senderName !== user.username) {
                    if (!privateChats.get(payloadData.senderName)) {
                        privateChats.set(payloadData.senderName, []);
                        setPrivateChats(new Map(privateChats));
                    }
                }
                break;
            case 'LEAVE':
                // Log the event when another user leaves
                console.log(`User ${payloadData.senderName} has left the room.`);
                break;
            case 'MESSAGE':
                setPublicChats((prevChats) => [...prevChats, payloadData]);
                break;
            default:
                break;
        }
    };

    const onPrivateMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        if (payloadData.senderName !== user.username) {
            if (privateChats.get(payloadData.senderName)) {
                privateChats.get(payloadData.senderName).push(payloadData);
                setPrivateChats(new Map(privateChats));
            } else {
                let list = [];
                list.push(payloadData);
                privateChats.set(payloadData.senderName, list);
                setPrivateChats(new Map(privateChats));
            }
        }
    };

    const onError = (error) => {
        console.log('WebSocket Error:', error);
    };

    // Message handlers
    const handleMessageChange = (event) => {
        const { value } = event.target;
        setUserData((prevData) => ({ ...prevData, message: value }));
    };

    const sendPublicMessage = () => {
        if (stompClient) {
            let chatMessage = {
                senderName: user.username,
                message: userData.message,
                status: 'MESSAGE',
            };
            stompClient.send(`/app/room/${roomId}/message`, {}, JSON.stringify(chatMessage));
            setUserData((prevData) => ({ ...prevData, message: '' }));
            resetTimer(); // 타이머 초기화
        }
    };

    // 타이머 초기화
    const resetTimer = () => {
        setTimeProgress(0);
        setIsTimerActive(true); // 타이머 시작
    };

    const sendPrivateMessage = () => {
        if (stompClient) {
            let chatMessage = {
                senderName: user.username,
                receiverName: tab,
                message: userData.message,
                status: 'MESSAGE',
            };
            if (user.username !== tab) {
                if (!privateChats.get(tab)) {
                    privateChats.set(tab, []);
                }
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
            setUserData((prevData) => ({ ...prevData, message: '' }));
        }
    };

    const updateEnteredPlayerId = (hostId, enteredPlayerId) => {
        console.log('hostId:', hostId);
        console.log('enteredPlayerId:', enteredPlayerId);

        fetch(`/api/room/${hostId}/enter?enteredPlayerId=${enteredPlayerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update room status');
                }
                console.log('Room status updated successfully');
            })
            .catch((error) => {
                console.error('Error updating room status:', error);
                alert('The room does not exist.');
                navigate('/firstPlay');
            });
    };

    const handleReadyStatus = () => {
        fetch(`/api/room/${roomId}/ready`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.userInformation.id }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update ready status');
                }
                console.log('Ready status updated successfully');
                // 상태 업데이트 로직 추가 가능
                setRoomStatus((prevStatus) => ({
                    ...prevStatus,
                    visitorReady: true, // 방문자 준비 상태로 설정 (호스트일 경우에도 이 부분 조정 필요)
                }));
            })
            .catch((error) => {
                console.error('Error updating ready status:', error);
            });
    };

    return (
        <div className="flex flex-col h-screen bg-blue-50">
            <img src="../src/assets/images/cheerGagul.png" 
                 className="w-1/12 max-w-xs h-auto" 
                 alt="cheer image"/>
            <h2 className="text-center text-xl font-bold mt-4">채팅방에 오신 것을 환영합니다!</h2>

            <div className="flex-grow p-5 overflow-y-auto w-1/2 mx-auto">
                <ul className="list-none p-0">
                    {publicChats.map((item, index) => (
                        <li 
                            key={index} 
                            className={`flex ${item.senderName === user.username ? 'justify-end' : 'justify-start'} mb-2`}
                        >
                            <div className={`px-4 py-2 rounded-xl ${item.senderName === user.username ? 'bg-green-100' : 'bg-gray-200'} max-w-lg break-words`}>
                                {item.senderName !== user.username ? (
                                    <strong>{item.senderName}:</strong>
                                ) : (
                                    <strong>나:</strong>
                                )} {item.message}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 타이머 바 영역 */}
            {isTimerActive && (            
                <div className="w-full bg-gray-300 h-1 relative">
                    <div 
                        className="bg-blue-500 h-1 absolute left-0 top-0 transition-all duration-100" 
                        style={{ width: `${timeProgress}%` }}
                    />
                </div>
            )}

            {/* 채팅 입력 및 준비 버튼 영역 */}
            <div className="flex justify-center p-4 space-x-2">
                <TextField 
                    id="outlined-basic" 
                    label="메시지를 입력하세요" 
                    variant="outlined"
                    value={userData.message}
                    onChange={handleMessageChange}
                    className="mr-4"
                />
                <Button variant="contained" color="primary" onClick={sendPublicMessage}>
                    전송
                </Button>
                <Button variant="contained" color="secondary" onClick={handleReadyStatus}>
                    {roomStatus.hostReady && roomStatus.visitorReady ? 'Both Ready' : 'Click to Ready'}
                </Button>
            </div>
        </div>
    );
};
