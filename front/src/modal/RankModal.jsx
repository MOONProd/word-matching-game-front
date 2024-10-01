import React from 'react';

const RankModal = ({ isOpen, isAnimating, onClose, userData }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center">
                <div 
                    className={`relative p-8 rounded-lg max-w-lg w-full transform transition-transform duration-500 ease-in-out 
                        ${isAnimating ? 'translate-y-0' : 'translate-y-full'}`}
                    style={{
                        backgroundImage: 'url(../src/assets/images/modal.png)',
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
                        {/* 순위 데이터를 렌더링 */}
                        <ol className="list-decimal list-inside">
                            {userData.map((user, index) => (
                                <li key={user.userId} className="flex justify-around items-center mb-10 text-black">
                                    <div className="text-lg font-semibold">{index + 1}위</div> {/* 순위 표시 */}
                                    {/* <img 
                                        src={user.profileImage || 'https://via.placeholder.com/150'} 
                                        alt={`${user.username} 프로필`}
                                        className="w-16 h-16 rounded-full mr-4"
                                    /> */}
                                    <p className="text-lg font-semibold">{user.username}</p>
                                    <p className="text-md text-green-500">{user.userScore}점</p>
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
