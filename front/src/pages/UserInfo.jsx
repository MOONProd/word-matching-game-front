import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';

const UserInfo = ({ children }) => {
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();

    const results = useQueries({
        queries: [
            {
                queryKey: ['username'],
                queryFn: async () => {
                    const response = await fetch('/api/username', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        if (response.status === 401) {
                            throw new Error('Unauthorized');
                        } else if (response.status === 404) {
                            throw new Error('Username not found');
                        } else {
                            throw new Error(`Error fetching username: ${response.status}`);
                        }
                    }
                    const data = await response.json();
                    return { username: data.username, status: data.status };  // Returning status along with username
                },
            },
            {
                queryKey: ['userInfo'],
                queryFn: async () => {
                    const response = await fetch('/api/userinfo-here', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        if (response.status === 404) {
                            return null; // Handle user info not found
                        } else if (response.status === 401) {
                            throw new Error('Unauthorized');
                        } else {
                            throw new Error(`Error fetching user information: ${response.status}`);
                        }
                    }
                    return response.json();
                },
            },
        ],
    });

    const usernameResult = results[0];
    const userInfoResult = results[1];

    useEffect(() => {
        if (!user && usernameResult.isSuccess && userInfoResult.isSuccess) {
            const { username, status } = usernameResult.data;  // Destructure status from response
            const userInfoData = userInfoResult.data;

            console.log('Fetched username:', username);
            console.log('Fetched user info:', userInfoData);
            console.log('User status:', status);  // Log the status

            if (status === 'noexist') {
                // Navigate to the nickname setup page if user does not exist
                navigate('/set-nickname');
            } else if (status === 'exist') {
                // Set the user information in Recoil state
                setUser({
                    username: username,
                    userInformation: userInfoData,
                });
                // Navigate to the main page
                navigate('/main');
            }
        }
    }, [
        user,
        usernameResult.isSuccess,
        userInfoResult.isSuccess,
        usernameResult.data,
        userInfoResult.data,
        setUser,
        navigate,
    ]);

    if (usernameResult.isLoading || userInfoResult.isLoading) {
        return <div>Loading user information...</div>;
    }

    if (usernameResult.isError) {
        console.log('Error fetching username:', usernameResult.error);
        if (usernameResult.error.message === 'Unauthorized') {
            navigate('/login');
            return null;
        } else {
            console.error('An error occurred:', usernameResult.error);
            return <div>Error loading user information</div>;
        }
    }

    if (userInfoResult.isError) {
        console.log('Error fetching user info:', userInfoResult.error);
        if (userInfoResult.error.message === 'Unauthorized') {
            navigate('/login');
            return null;
        } else {
            console.error('An error occurred:', userInfoResult.error);
            return <div>Error loading user information</div>;
        }
    }

    if (!user) {
        return <div>Loading user information...</div>;
    }

    return <>{children}</>;
};

export default UserInfo;
