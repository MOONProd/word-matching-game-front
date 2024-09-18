// RouterList.js
import React from 'react';
import MainPage from "./pages/MainPage.jsx";
import {MapPage} from "./pages/MapPage.jsx";
import {ChatPage} from "./pages/ChatPage.jsx";
import Test from "./pages/Test.jsx";
import TestTwo from "./pages/TestTwo.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import {createBrowserRouter} from "react-router-dom"; // Ensure the path is correct

export const RouterList = () => [
    {
        path: "/",
        element: <MainPage />,
    },
    {
        path: "/map",
        element: <MapPage />,
    },
    {
        path: "/chat",
        element: <ChatPage />,
    },
    {
        path: "/login",
        children: [
            {
                path: "",
                element: <LoginPage />,
            },
            {
                path: "done",
                element: <Test />
            },
            {
                path: "dummy",
                element: <ProtectedRoute element={<TestTwo />} />
            },
        ],
    },
];

export const RouterObject = createBrowserRouter(RouterList());
