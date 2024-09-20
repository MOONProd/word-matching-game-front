import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserInfo from './UserInfo'; // Import UserInfo component

function ProtectedRoute({ element }) {
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            // No access token found
            console.log('No access token found. Redirecting to login.');
            setIsValid(false);
            return;
        }

        // Call the server to check token validity
        fetch('/auth/check-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include', // Include cookies if necessary
        })
            .then(response => {
                if (response.status === 200) {
                    setIsValid(true);
                } else {
                    setIsValid(false);
                }
            })
            .catch(error => {
                console.error('Error checking token validity:', error);
                setIsValid(false);
            });
    }, []);

    if (isValid === null) {
        // Still checking token validity
        return <div>Loading...</div>;
    }

    if (isValid === false) {
        // Token is invalid or expired
        console.log('Access token is invalid or expired. Redirecting to login.');
        return <Navigate to="/login" />;
    }

    // If token is valid, render UserInfo component to ensure user information is fetched
    return (
        <UserInfo>
            {element}
        </UserInfo>
    );
}

export default ProtectedRoute;
