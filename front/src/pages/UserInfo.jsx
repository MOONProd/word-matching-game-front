import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from './userAtom'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

const UserInfo = ({ children }) => {
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            // Fetch user info from the backend if it doesn't exist in the Recoil state
            fetch('/api/user-info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setUser(data);
                })
                .catch(error => {
                    console.log('Error fetching user info', error);
                    // Redirect to login if the user is not authenticated
                    navigate('/login');
                });
        }
    }, [user, setUser, navigate]);

    // While user info is loading, show a loading indicator
    if (!user) {
        return <div>Loading user information...</div>;
    }

    // Once user info is available, render the wrapped components
    return <>{children}</>;
};

export default UserInfo;
