import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../recoil/testAtom";
"use client";

export const TestMap = () => {
    const googleMapApi = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const googleMapId = import.meta.env.VITE_APP_GOOGLE_MAPS_ID;

    const mapData = useRecoilValue(mapAtom); //리코일
    const [openInfoWindowId, setOpenInfoWindowId] = useState(null);
    const [mapKey, setMapKey] = useState(0); // 첫번째 값, 즉 리스트의 첫번째 값을 기준점으로 함

    // 첫번째 값을 통한 강제 첫 리렌더링
    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1);
    }, [mapData]);

    return (
        <div style={{ maxWidth: '1000px', height: '600px', margin: 'auto' }}>
            <div className="mb-10">hahahah</div>
            <APIProvider apiKey={googleMapApi}>
                <div style={{ height: '100%', width: '100%' }}>
                    {mapData && (
                        <Map
                            key={mapKey} // 강제 리렌더링
                            defaultZoom={18}
                            defaultCenter={{ lat: mapData.lat, lng: mapData.long }}
                            mapId={googleMapId}
                        >
                            {/* 마커부분 */}
                            <AdvancedMarker
                                key={mapKey}
                                position={{ lat: mapData.lat, lng: mapData.long }}
                                onClick={() => setOpenInfoWindowId(mapKey)}
                            >
                                {/* 타입에 따른 마커 색깔변경 */}
                                {mapData.type === '향수 공방' && <Pin background="purple" />}
                                {mapData.type === '기타' && <Pin background="gray" />}
                                {!['향수 공방', '기타'].includes(mapData.type) && (
                                    <Pin background="default" />
                                )}
                            </AdvancedMarker>

                            {openInfoWindowId === mapKey && (
                                <InfoWindow
                                    key={mapKey}
                                    position={{ lat: mapData.lat, lng: mapData.long }}
                                    onCloseClick={() => setOpenInfoWindowId(null)}
                                >
                                    <div>
                                        <p><strong>유형:</strong> {mapData.type}</p>
                                        <p><strong>주소:</strong> {mapData.description}</p>
                                    </div>
                                </InfoWindow>
                            )}
                        </Map>
                    )}
                </div>
            </APIProvider>
        </div>
    );
}

