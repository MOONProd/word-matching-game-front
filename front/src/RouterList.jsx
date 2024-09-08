import {Layout} from "./layout/Layout.jsx";
import {Test} from "./pages/Test.jsx";
import { createBrowserRouter } from "react-router-dom";



export const RouterList = () => [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                // 지도 예시, localhost:5173/test 로 가면 확인 가능
                path: "test",
                element: <Test />,
            },
        ],
    },
]

export const RouterObject = createBrowserRouter(RouterList());
