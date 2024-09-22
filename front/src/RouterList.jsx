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
import {LoginPage} from './pages/LoginPage.jsx';
import NicknamePage from './pages/NicknamePage.jsx';
import TestTwo from './pages/TestTwo.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
import PresenceTracker from "./pages/PresenseTracker.jsx";

// Ensure all imports are correct and paths are adjusted as per your project structure

export const RouterList = () => [
    {
        path: '/',
        element: <MainPage />,
    },
    {
        path: '/newlogin',
        element: <NewLoginPage />,
    },
    {
        path: '/firstPlay',
        element: (
            <ProtectedRoute>
                <FirstPlayMap />
            </ProtectedRoute>
        ),
    },
    {
        path: '/secondPlay',
        element: (
            <ProtectedRoute>
                <SecondPlayMap />
            </ProtectedRoute>
        ),
    },
    {
        path: '/wait/:roomId',
        element: (
            <ProtectedRoute>
                <PresenceTracker>
                    <WaitingPage />
                </PresenceTracker>
            </ProtectedRoute>
        ),
    },
    {
        path: '/result',
        element: <ResultPage />,
    },
    {
        path: '/chat',
        element: (
            <ProtectedRoute>
                <ChatPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/wordgame',
        element: (
            <ProtectedRoute>
                <GamePage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        children: [
            {
                path: '',
                element: <LoginPage />,
            },
            {
                path: 'done',
                element: <NicknamePage />,
            },
            {
                path: 'dummy',
                element: (
                    <ProtectedRoute>
                        <TestTwo />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];

export const RouterObject = createBrowserRouter(RouterList());
