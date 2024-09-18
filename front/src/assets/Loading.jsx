import React from 'react';

function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <svg
                version="1.1"
                id="L9"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 100 100"
                enableBackground="new 0 0 0 0"
                xmlSpace="preserve"
                width="100px"
                height="100px"
            >
                <path
                    fill="#3498db"
                    d="M73.9,25.1C72.1,24.4,70.4,23.9,68.7,23.5c-3.4-0.7-6.8-0.6-10.2,0.1c-4.2,0.8-8.1,2.7-11.4,5.4c-2.7,2.1-5.1,4.6-7.1,7.4c-2.7,3.6-4.8,7.8-6.2,12.2c-0.6,1.8-1.1,3.6-1.4,5.5c-0.4,2.2-0.5,4.5-0.3,6.8c0.2,2.2,0.8,4.3,1.7,6.3c1.3,3.1,3.2,5.8,5.5,8.2c2.8,3,6.2,5.2,10,6.4c3.5,1.1,7.2,1.4,10.8,0.8c3.6-0.6,7-2.1,10.2-4.1c2.9-1.8,5.4-4.2,7.4-7.1c2.7-3.6,4.5-7.9,5.4-12.3c0.4-1.8,0.7-3.6,0.9-5.4c0.3-2.2,0.3-4.5,0.1-6.7c-0.2-2.3-0.7-4.5-1.5-6.6c-1.2-3.4-2.9-6.6-5.1-9.5C82.4,29.7,78.5,27,73.9,25.1zM79.5,45.1C77.5,46.9,75.3,48.4,72.9,49.6c-3.1,1.6-6.4,2.5-9.8,2.8c-3.4,0.3-6.8-0.1-10.1-1.3c-2.7-1-5.1-2.4-7.2-4.2c-1.8-1.5-3.3-3.3-4.6-5.2c-1.3-2-2.2-4.1-2.8-6.4c-0.5-2.2-0.6-4.4-0.4-6.6c0.2-2.1,0.7-4.2,1.4-6.2c1.2-3.5,3.1-6.8,5.5-9.6c1.7-2,3.6-3.7,5.9-5c2.7-1.6,5.6-2.5,8.6-3c2.3-0.4,4.6-0.4,6.9,0c2.3,0.4,4.5,1.3,6.5,2.5c2.2,1.4,4.1,3.2,5.8,5.3c3.2,4,4.9,8.7,5.5,13.5C81.5,39.8,80.9,42.6,79.5,45.1z"
                >
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        dur="2s"
                        from="0 50 50"
                        to="360 50 50"
                        repeatCount="indefinite"
                    />
                </path>
            </svg>
        </div>
    );
}

export default Loading;
