import React, { useEffect, useState } from 'react';

function Test(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/auth/user-info', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Access Token:', data.accessToken);
                console.log('Refresh Token:', data.refreshToken);
                setUser(data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    console.log(user);

    return (
        <div>
            <div><h1>오....?</h1></div>
            {user ? (
                <div>
                    <h1>흠..... 자네의 이름은 {user.name}이고</h1>
                    <h1>이메일은 {user.email}이구먼 으헤헿ㅎ</h1>
                </div>
            ) : (
                <h1>뭔가 보인다....!</h1>
            )}
        </div>
    );
}

export default Test;
