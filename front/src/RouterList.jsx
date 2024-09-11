// import {Layout} from "./layout/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
import ChatPage from "./pages/ChatPage.jsx"
// import {Test} from "./pages/Test.jsx";
import { createBrowserRouter } from "react-router-dom";
import { MapPage } from "./pages/MapPage.jsx";



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
]

export const RouterObject = createBrowserRouter(RouterList());
