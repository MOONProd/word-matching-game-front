// src/pages/ProtectedRoute.jsx
import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

function ProtectedRoute({ children }) {


    const { isLoading, isError } = useQuery({
        queryKey: ['checkToken'],
        queryFn: async () => {
            const response = await fetch('/auth/check-token', {
                method: 'GET',
                credentials: 'include', // Include cookies if necessary
            });

            if (!response.ok) {
                throw new Error('Unauthorized');
            }

            // Return any necessary data (optional)
            return response.status;
        },
        retry: false, // Optional: prevent retries if unauthorized
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        console.log('Access token is invalid or expired. Redirecting to login.');
        return <Navigate to="/" />;
    }

    return (
        <>
            {children}
        </>
    );
}

export default ProtectedRoute;
