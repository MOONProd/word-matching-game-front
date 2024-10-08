// src/router/RouterList.js
import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

// Import your components
import MainPage from './pages/MainPage.jsx';
import NewLoginPage from './pages/NewLoginPage.jsx';
import FirstPlayMap from './pages/FirstPlayMap.jsx';
import {SecondPlayMap} from './pages/SecondPlayMap.jsx';
import {WaitingPage} from './pages/WaitingPage.jsx';
import ResultPage from './pages/ResultPage.jsx';
import NicknamePage from './pages/NicknamePage.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
import PresenceTracker from "./pages/PresenseTracker.jsx";
import UserInfo from "./pages/UserInfo.jsx";
import InfoPage from './pages/InfoPage.jsx';


// Ensure all imports are correct and paths are adjusted as per your project structure

export const RouterList = () => [
    
    {
        path: '/',
        element: <NewLoginPage />,
    },
    {
        path: '/login/done',
        element: (
            <ProtectedRoute>
                <NicknamePage/>
            </ProtectedRoute>
        ), // 로그인 후 접근
    },
    {
        path: '/main',
        element: (
            <ProtectedRoute>
                <Outlet /> {/* 자식 컴포넌트를 렌더링 */}
            </ProtectedRoute>
        ), // 로그인 후 접근
        children: [
            {
                path: '',
                element: (
                    <UserInfo>
                        <MainPage />
                    </UserInfo>
                ),
            },
            {
                path: 'info',
                element: (
                    <UserInfo>
                        <InfoPage />
                    </UserInfo>
                ),
            },
            {
                path: 'firstPlay',
                element: (
                    <UserInfo>
                        <FirstPlayMap />
                    </UserInfo>
                    ),
            },
            {
                path: 'secondPlay',
                children: [
                    {
                        path: '',
                        element: (
                            <UserInfo>
                                <SecondPlayMap />
                            </UserInfo>),
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
        path: '/result',
        element: <ResultPage />,
    },
];

export const RouterObject = createBrowserRouter(RouterList());
