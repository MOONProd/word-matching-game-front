import React from 'react';

function MainPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="relative flex flex-col items-center mb-20">
                <svg width="400" height="200" viewBox="0 0 400 200">
                    <defs>
                        <path
                            id="curve"
                            d="M 65,120
                               A 200,200 0 0,1 340,120"
                            fill="transparent"
                        />
                    </defs>
                    <text width="400">
                        <textPath
                            href="#curve"
                            startOffset="50%"
                            textAnchor="middle"
                            fontSize="36"
                            fontWeight="bold"
                            dominantBaseline="middle"
                        >
                            WORD BRIDGE
                        </textPath>
                    </text>
                </svg>
            </div>
            <div className="flex flex-col space-y-4">
                <button className="border-2 border-black rounded-full px-8 py-2 text-lg">게임방법</button>
                <button className="border-2 border-black rounded-full px-8 py-2 text-lg">게임시작</button>
            </div>
        </div>
    );
}

export default MainPage;
