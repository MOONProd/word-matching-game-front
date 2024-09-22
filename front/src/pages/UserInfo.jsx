import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../recoil/userAtom'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

const UserInfo = ({ children }) => {
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            // Fetch user info from the backend if it doesn't exist in the Recoil state
            fetch('/api/userinfo-here', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies if necessary
            })
                .then(response => {
                    if (!response.ok) {
                        console.log(response.status);
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Fetched user info:", data);
                    setUser(data);
                })
                .catch(error => {
                    console.log('Error fetching user info:', error);
                    // Redirect to login if the user is not authenticated or an error occurs
                    navigate('/');
                });
        }
    }, [user, setUser, navigate]);

    console.log("This is user info:", user);

    // While user info is loading, show a loading indicator
    // if (!user) {
    //     return <div>Loading user information...</div>;
    // }

    // Once user info is available, render the wrapped components
    return <>{children}</>;
};

export default UserInfo;
