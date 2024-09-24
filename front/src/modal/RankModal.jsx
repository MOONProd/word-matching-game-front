import React from 'react';

const RankModal = ({ isOpen, isAnimating, onClose, userData }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center">
                <div 
                    className={`relative p-8 rounded-lg max-w-lg w-full transform transition-transform duration-500 ease-in-out 
                        ${isAnimating ? 'translate-y-0' : 'translate-y-full'}`}
                    style={{
                        backgroundImage: 'url(../src/assets/images/test-modal.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '800px',
                        height: '600px',
                        fontFamily: 'MyCustomFont, sans-serif',
                    }}
                >
                    <button 
                        className="absolute top-4 right-4 px-4 py-2 bg-amber-700 text-white rounded-full"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                    <div className="text-center text-white">
                        <h2 className="text-2xl font-bold mb-4">이웃순위</h2>
                        {/* 1위 사용자 */}
                        <div className="flex justify-around text-center items-center space-x-4 mb-4 text-black">
                            <img 
                                src={userData[0].profilePic} 
                                alt={`${userData[0].username} 프로필`}
                                className="w-24 h-24 rounded-full mx-0 mb-4"
                            />
                            <div className="mx-10 text-xl font-bold">{userData[0].username}</div>
                            <div className="text-lg text-green-600">{userData[0].score}점</div>
                        </div>
                        {/* 2위 ~ 5위 사용자 */}
                        <ol className="list-decimal list-inside">
                            {userData.slice(1, 5).map((user, index) => (
                                <li key={user.id} className="flex justify-around items-center mb-4 text-black">
                                    <img 
                                        src={user.profilePic} 
                                        alt={`${user.username} 프로필`}
                                        className="w-16 h-16 rounded-full mr-4"
                                    />
                                    <p className="text-lg font-semibold">{user.username}</p>
                                    <p className="text-md text-green-500">{user.score}점</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        )
    );
};

export default RankModal;
