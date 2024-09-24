import React from 'react';

const RuleModal = ({ isOpen, isAnimating, onClose }) => {
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
                        <h2 className="text-2xl font-bold">게임방법</h2>
                    </div>
                    <div className="flex flex-col mt-28 items-center h-full text-black text-lg">
                        <p className="text-center">이 게임은 주어진 단어로 새로운 단어를 이어가는 게임입니다.</p>
                        <p className="mt-2 text-center"><strong>예시:</strong> "사과" → "과일" → "일출"</p>
                        <br />
                        <p className="text-center">선공을 선택 시, 현재 접속한 이웃에게 대결 신청을 할 수 있습니다.</p>
                        <p className="text-center">후공을 선택 시, 원하는 지역에서 대결을 대기합니다.</p>
                        <br />
                        <p className="text-center">한 게임에서 이기면 +30점, 지면 -20점이 누적됩니다.</p>
                        <p className="text-center">누적된 점수로 순위가 매겨집니다.</p>
                    </div>
                </div>
            </div>
        )
    );
};

export default RuleModal;
