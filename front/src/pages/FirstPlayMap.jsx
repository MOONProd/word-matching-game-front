import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../recoil/testAtom";
import { useNavigate } from "react-router-dom";
// import Loading from "../assets/loading";

function FirstPlayMap(props) {
    const googleMapApi = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const googleMapId = import.meta.env.VITE_APP_GOOGLE_MAPS_ID;
    const navigate = useNavigate();

    const mapData = useRecoilValue(mapAtom);
    const [mapKey, setMapKey] = useState(0);
    // const [isLoading, setIsLoading] = useState(false);  // 로딩 상태 관리
    const [isModalOpen,setIsModalOpen] = useState(false);

    const pinColors = ["#FFBB00", "#FF5733", "#33FF57", "#3357FF", "#FF33A6"];

    const getRandomColor = () => {
        return pinColors[Math.floor(Math.random() * pinColors.length)];
    };

    const handleHomeClick = ()=>{
        navigate('/');
    };

    const handlePinClick = ()=>{
        //data 받아와서 어떤 사용자인지 connect 해서
        setIsModalOpen(true);
    };

    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1);
    }, []);

    // const handleMapLoad = () => {
    //     console.log("load!");
    //     setIsLoading(false);  // 지도가 로드되면 로딩 상태를 false로 설정
    // };

    return (
        // 지도 전체화면
        <div style={{ maxWidth: '100vw', height: '100vh', margin: 'auto' }}>
            {/* {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <h2>로딩중...</h2>
                    <Loading/>
                </div>
            ) : ( */}
                <APIProvider apiKey={googleMapApi}>
                    <div style={{ height: '100%', width: '100%' }}>
                        {mapData && (
                            <Map
                                key={mapKey}
                                defaultZoom={10}
                                defaultCenter={{ lat: 37.5665, lng: 126.9780 }}
                                mapId={googleMapId}
                                options={{
                                    mapTypeControl: false,
                                }}
                                // onLoad={handleMapLoad}  // 지도 로드 완료 시 호출
                            >
                                {mapData.map((location, index) => {
                                    const color = getRandomColor();
                                    return(
                                        <AdvancedMarker
                                            key={index}
                                            position={{ lat: location.lat, lng: location.long }}
                                            onClick={handlePinClick}
                                        >
                                            <Pin
                                                scale={3}
                                                background={color}
                                                borderColor={color}
                                            >
                                                <img src="../src/assets/images/gaguli.png" width="50" height="50" alt="Pin Icon" />
                                            </Pin>
                                        </AdvancedMarker>
                                    );
                                })}
                            </Map>
                        )}
                    </div>
                </APIProvider>
            {/* )} */}

            <button
                onClick={handleHomeClick}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 1000,
                    backgroundColor: '#fff',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
            >
                <img 
                    src="../src/assets/svg/home.svg" 
                    className="w-5 max-w-xs md:max-w-sm lg:max-w-md" 
                    alt="Home Icon" 
                />

            </button>

            {/* 모달 창 */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white text-center p-8 rounded-lg max-w-lg w-full"
                         style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
                        <h1 className="text-2xl font-bold mb-4">게임신청</h1>
                        <h3>사용자님에게 게임을 신청하시겠습니까? </h3>
                        <button 
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full"
                        >
                            예
                        </button>
                        <button 
                            className="mt-4 px-4 py-2 text-green-500 rounded-full"
                            onClick={()=>{navigate('/firstPlay'); setIsModalOpen(false)}}
                        >
                            아니요
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default FirstPlayMap;
