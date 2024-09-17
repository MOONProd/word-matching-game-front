// import {Layout} from "./layout/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
// import {Test} from "./pages/Test.jsx";
import { createBrowserRouter } from "react-router-dom";
import { SecondPlayMap } from "./pages/SecondPlayMap.jsx";
import FirstPlayMap from "./pages/FirstPlayMap.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import ChatPlay from "./pages/ChatPlay.jsx";



export const RouterList = () => [
    {
        path: "/",
        element: <MainPage />,
    },
    {
        path: "/firstPlay",
        element: <FirstPlayMap />,
    },
    {
        path: "/secondPlay",
        element: <SecondPlayMap />,
    },
    {
        path: "/play",
        element: <ChatPlay />,
    },
    {
        path: "/result",
        element: <ResultPage />,
    },
]

export const RouterObject = createBrowserRouter(RouterList());
