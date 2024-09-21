import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider
import { RouterObject } from './RouterList';
import './App.css';

// Create an instance of QueryClient
const queryClient = new QueryClient();

// Render the application with QueryClientProvider wrapping everything
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={RouterObject} />
            </QueryClientProvider>
        </RecoilRoot>
    </StrictMode>,
);
