

export const LoginPage = () => {

    const googleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    }

    const githubLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/github';
    }


    return(
        <>
            <div className="flex justify-center mt-5 flex-col items-center">
                <h1>로그인 테스트</h1>
                <div>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full" onClick={googleLogin}>구글 로그인</button>
                </div>
                <div>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full" onClick={githubLogin}>깃헢 로그인</button>
                </div>
            </div>
        </>
    )
}