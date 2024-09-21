import { createBrowserRouter } from 'react-router-dom';
import MainPage from './pages/MainPage.jsx';
import {ChatPage} from './pages/ChatPage.jsx';
import ResultPage from './pages/ResultPage.jsx';
import FirstPlayMap from './pages/FirstPlayMap.jsx';
import {SecondPlayMap} from './pages/SecondPlayMap.jsx';
import WaitingPage from './pages/WaitingPage.jsx';
import NewLoginPage from './pages/NewLoginPage.jsx';
import NicknamePage from './pages/NicknamePage.jsx';
import {GamePage} from './pages/GamePage.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';

export const RouterList = () => [
    {
        path: "/",
        element: <NewLoginPage />, // 로그인 전 접근 가능
    },
    {
        path: "/done",
        element: <ProtectedRoute />, // 로그인 후 접근
        children: [
            {
                path: "",
                element: <NicknamePage />,
            },
        ],
    },
    {
        path: "/main",
        element: <ProtectedRoute />, // 로그인 후 접근
        children: [
            {
                path: "",
                element: <MainPage />,
            },
            {
                path: "firstPlay",
                element: <FirstPlayMap />,
            },
            {
                path: "secondPlay",
                children: [
                    {
                        path: "",
                        element: <SecondPlayMap />,
                    },
                    {
                        path: "wait",
                        element: <WaitingPage />,
                    },
                ],
            },
        ],
    },
    {
        path: "/chat",
        element: <ProtectedRoute />, // 로그인 후 접근
        children: [
            {
                path: "",
                element: <ChatPage />,
            },
            {
                path: "result",
                element: <ResultPage />,
            },
        ],
    },
    {
        path: "/wordgame",
        element: <ProtectedRoute />, // 로그인 후 접근
        children: [
            {
                path: "",
                element: <GamePage />,
            },
            {
                path: "result",
                element: <ResultPage />,
            },
        ],
    },
];

export const RouterObject = createBrowserRouter(RouterList());
