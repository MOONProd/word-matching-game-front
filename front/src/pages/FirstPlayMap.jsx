import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../recoil/testAtom";
import { useNavigate } from "react-router-dom";

function FirstPlayMap(props) {
    const googleMapApi = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const googleMapId = import.meta.env.VITE_APP_GOOGLE_MAPS_ID;
    const navigate = useNavigate();

    const mapData = useRecoilValue(mapAtom);
    const [mapKey, setMapKey] = useState(0);

    const pinColors = ["#FFBB00", "#FF5733", "#33FF57", "#3357FF", "#FF33A6"];

    const getRandomColor = () => {
        return pinColors[Math.floor(Math.random() * pinColors.length)];
    };

    const handleHomeClick = ()=>{
        navigate('/');
    };

    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1);
    }, []);

    return (
        // 지도 전체화면
        <div style={{ maxWidth: '100vw', height: '100vh', margin: 'auto' }}>
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
                        >
                            {mapData.map((location, index) => {
                                const color = getRandomColor();
                                return(
                                    <AdvancedMarker
                                        key={index}
                                        position={{ lat: location.lat, lng: location.long }}
                                        onClick={() => alert(`${location.name}를 선택하셨습니다.`)}
                                    >
                                        <Pin
                                            scale={3}
                                            background={color}
                                            borderColor={color}
                                        >
                                            <img src="../src/assets/gaguli.png" width="50" height="50" alt="Pin Icon" />
                                        </Pin>
                                    </AdvancedMarker>
                                );
                            })}
                        </Map>
                    )}
                </div>
            </APIProvider>

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
              <img src="../src/assets/home.png" class="w-5 max-w-xs md:max-w-sm lg:max-w-md" alt="Home Icon" />

            </button>
        </div>
    );
}

export default FirstPlayMap;
