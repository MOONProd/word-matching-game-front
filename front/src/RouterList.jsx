// import { Layout } from "./layout/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
import { ChatPage } from "./pages/ChatPage.jsx";

import { createBrowserRouter } from "react-router-dom";
import { MapPage } from "./pages/MapPage.jsx";
import Test from "./pages/Test.jsx";

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
                path: "done",
                element: <Test/>,
            },
        ],
    },
];

export const RouterObject = createBrowserRouter(RouterList());
