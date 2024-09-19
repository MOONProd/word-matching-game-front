// import {Layout} from "./layout/Layout.jsx";
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
