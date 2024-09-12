import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../recoil/testAtom";

function FirstPlayMap(props) {
    const googleMapApi = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const googleMapId = import.meta.env.VITE_APP_GOOGLE_MAPS_ID;

    const mapData = useRecoilValue(mapAtom);
    const [mapKey, setMapKey] = useState(0);

    // 5가지 색상 정의
    const pinColors = ["#FFBB00", "#FF5733", "#33FF57", "#3357FF", "#FF33A6"];

    // 랜덤 색상 선택 함수
    const getRandomColor = () => {
        return pinColors[Math.floor(Math.random() * pinColors.length)];
    };

    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1);
    }, []);

    return (
        <div style={{ maxWidth: '1000px', height: '600px', margin: 'auto' }}>
            <APIProvider apiKey={googleMapApi}>
                <div style={{ height: '100%', width: '100%' }}>
                    {mapData && (
                        <Map
                            key={mapKey}
                            defaultZoom={10}
                            defaultCenter={{ lat: 37.5665, lng: 126.9780 }} // 서울 중심으로 설정
                            mapId={googleMapId}
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
                                            background={color} // 랜덤 색상 적용
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
        </div>
    );
}

export default FirstPlayMap;
