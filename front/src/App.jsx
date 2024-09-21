import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { RouterObject } from './RouterList';
import { RecoilRoot } from 'recoil';
import './App.css';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RecoilRoot>
            <RouterProvider router={RouterObject}/>
        </RecoilRoot>
    </StrictMode>,
);
