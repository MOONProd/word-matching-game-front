import React from 'react';

const LogoutModal = ({ isOpen, onLogout, onClose }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div 
                    className="relative p-8 rounded-lg max-w-lg w-full bg-white"
                    style={{
                        width: '400px',
                        height: '200px',
                        fontFamily: 'MyCustomFont, sans-serif',
                    }}
                >
                    <div className="text-center mt-8">
                        <h2 className="text-2xl font-bold mb-4">로그아웃 하시겠습니까?</h2>
                        <div className="flex justify-center mt-4 space-x-4">
                            <button 
                                className="px-4 py-2 bg-red-500 text-white rounded-full"
                                onClick={onLogout}
                            >
                                로그아웃
                            </button>
                            <button 
                                className="px-4 py-2 bg-gray-300 text-black rounded-full"
                                onClick={onClose}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default LogoutModal;
