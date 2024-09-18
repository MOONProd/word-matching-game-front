import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TestTwo(props) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        // Fetch user info using the access token
        fetch('/auth/user-info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include' // Include cookies if necessary
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }
                return response.json();
            })
            .then(data => {
                setUser(data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // Handle error appropriately (e.g., show a message)
            });
    }, []);

    const handleLogout = () => {
        const accessToken = localStorage.getItem('accessToken');

        fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Include cookies if necessary
        })
            .then(response => {
                if (response.ok) {
                    // Clear tokens from localStorage
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    // Redirect to login page
                    navigate('/login');
                } else {
                    throw new Error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
                // Handle error appropriately (e.g., show a message)
            });
    };

    return (
        <div>
            {user ? (
                <div>
                    <h1>Welcome to TestTwo Component</h1>
                    <h2>User: {user.name}</h2>
                    <h2>Email: {user.email}</h2>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
}

export default TestTwo;
