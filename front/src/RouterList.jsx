// import {Layout} from "./layout/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
import {ChatPage} from "./pages/ChatPage.jsx";
import Test from "./pages/Test.jsx";
import TestTwo from "./pages/TestTwo.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import {createBrowserRouter} from "react-router-dom";
import ResultPage from "./pages/ResultPage.jsx";
import FirstPlayMap from "./pages/FirstPlayMap.jsx";
import {SecondPlayMap} from "./pages/SecondPlayMap.jsx"; // Ensure the path is correct
import WaitingPage from "./pages/WaitingPage.jsx";
import NewLoginPage from "./pages/NewLoginPage.jsx";

export const RouterList = () => [
    {
        path: "/",
        element: <MainPage />,
    },
    {
        path: "/newlogin",
        element: <NewLoginPage />,
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
        path: "/wait",
        element: <WaitingPage />,
    },
    {
        path: "/result",
        element: <ResultPage />,
    },
    {
        path: "/chat",
        element: <ProtectedRoute element={<ChatPage />} /> ,
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
