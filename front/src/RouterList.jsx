// src/router/RouterList.js
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Import your components
import MainPage from './pages/MainPage.jsx';
import NewLoginPage from './pages/NewLoginPage.jsx';
import FirstPlayMap from './pages/FirstPlayMap.jsx';
import {SecondPlayMap} from './pages/SecondPlayMap.jsx';
import {WaitingPage} from './pages/WaitingPage.jsx';
import ResultPage from './pages/ResultPage.jsx';
import {ChatPage} from './pages/ChatPage.jsx';
import {GamePage} from './pages/GamePage.jsx';
// import {LoginPage} from './pages/LoginPage.jsx';
import NicknamePage from './pages/NicknamePage.jsx';
// import TestTwo from './pages/TestTwo.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
import PresenceTracker from "./pages/PresenseTracker.jsx";
import UserInfo from "./pages/UserInfo.jsx";

// Ensure all imports are correct and paths are adjusted as per your project structure

export const RouterList = () => [
    {
        path: '/',
        element: <NewLoginPage />,
    },
    {
        path: '/login/done',
        element: <ProtectedRoute />, // 로그인 후 접근
        children: [
            {
                path: '',
                element: <NicknamePage />,
            },
        ],
    },
    {
        path: '/main',
        element: <ProtectedRoute />, // 로그인 후 접근
        children: [
            {
                path: '',
                element: <UserInfo><MainPage /></UserInfo>,
            },
            {
                path: 'firstPlay',
                element: <FirstPlayMap />,
            },
            {
                path: 'secondPlay',
                children: [
                    {
                        path: '',
                        element: <SecondPlayMap />,
                    },
                    {
                        path: 'wait/:roomId',
                        element: (
                            <PresenceTracker>
                                <UserInfo>
                                    <WaitingPage />
                                </UserInfo>
                            </PresenceTracker>
                        ),
                    },
                ],
            },
        ],

    },
    {
        path: '/chat',
        element: <ProtectedRoute />,
        children: [
            {
                path: '',
                element: <ChatPage />,
            },
            {
                path: 'result',
                element: <ResultPage />,
            },

        ],
    },
    {
        path: '/wordgame',
        element: <ProtectedRoute />,
        children: [
            {
                path: '',
                element: <GamePage />,
            },
            {
                path: 'result',
                element: <ResultPage />,
            },

        ],
    },
];

export const RouterObject = createBrowserRouter(RouterList());
