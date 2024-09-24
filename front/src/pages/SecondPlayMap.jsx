import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useRecoilValue } from "recoil";
import { SeoulAtom } from "../recoil/SeoulAtom";
import { useNavigate } from "react-router-dom";
import { userAtom } from '../recoil/userAtom';
import Loading from "../assets/loading";

export const SecondPlayMap = () => {
    const googleMapApi = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const googleMapId = import.meta.env.VITE_APP_GOOGLE_MAPS_ID;
    const navigate = useNavigate();

    const seoulLocal = useRecoilValue(SeoulAtom);
    const [mapKey, setMapKey] = useState(0);
    const [markerPosition, setMarkerPosition] = useState({ lat: seoulLocal.lat, lng: seoulLocal.long });

    const [infoWindowOpen, setInfoWindowOpen] = useState(true);
    const [overlayVisible, setOverlayVisible] = useState(true);

    const user = useRecoilValue(userAtom);

    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1);
    }, [seoulLocal]);

    const handleMarkerDragStart = (event) => {
        console.log("Drag started", event.latLng.lat(), event.latLng.lng());
    };

    const handleMarkerDrag = (event) => {
        console.log("Dragging", event.latLng.lat(), event.latLng.lng());
        setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        setInfoWindowOpen(false);
    };

    const handleMarkerDragEnd = (event) => {
        console.log("Drag ended", event.latLng.lat(), event.latLng.lng());
        setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    };

    const handleHomeClick = () => {
        navigate('/main');
    };

    const handleinfoClick = () => {
        setOverlayVisible(true);
        setInfoWindowOpen(true);
    };

    const handleLoadClick = async () => {
        // Send the marker position to the server
        try {
            const response = await fetch('/api/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies if necessary
                body: JSON.stringify({
                    userId: user.userInformation.id,
                    latitude: markerPosition.lat,
                    longitude: markerPosition.lng,
                }),
            });

            if (!response.ok) {
                // Handle error
                throw new Error('Failed to create room');
            }

            // Get the room ID (host ID) from the response if available
            const data = await response.json();
            const roomId = data.roomId || user.userInformation.id;

            // Proceed to waiting room, pass roomId and isHost flag
            navigate(`/main/secondPlay/wait/${roomId}`, { state: { isHost: true } });
        } catch (error) {
            console.error('Error creating room:', error);
            // Optionally display an error message to the user
        }
    };

    const handleOverlayClose = () => {
        setOverlayVisible(false);
    };

    return (
        <div style={{ maxWidth: '100vw', height: '100vh', margin: 'auto', position: 'relative' }}>
            {overlayVisible && (
                <div
                    className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    style={{ zIndex: 1000 }} // Map 위에 오버레이를 배치하도록 z-index 설정
                >
                    <div
                        className="bg-white p-8 rounded-lg text-center"
                        style={{
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                            zIndex: 1000,
                            fontFamily: 'MyCustomFont, sans-serif',
                        }}
                    >
                        <h2 className="text-xl font-bold mb-4">핀을 드래그 해주세요!</h2>
                        <p>게임을 하고자 하는 지역으로 드래그 해주세요.</p>
                        <button
                            onClick={handleOverlayClose}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
            <APIProvider apiKey={googleMapApi}>
                <div style={{ height: '100%', width: '100%' }}>
                    {seoulLocal && (
                        <Map
                            key={mapKey}
                            defaultZoom={18}
                            defaultCenter={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                            mapId={googleMapId}
                            options={{
                                mapTypeControl: false,
                                maxZoom: 20,
                            }}
                        >
                            <AdvancedMarker
                                key={mapKey}
                                position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                                draggable={true}
                                onDragStart={handleMarkerDragStart}
                                onDrag={handleMarkerDrag}
                                onDragEnd={handleMarkerDragEnd}
                            >
                                <Pin scale={3}
                                     background={"#FFBB00"}
                                     borderColor={"#FFBB00"}
                                >
                                    <img src="../src/assets/images/gaguli.png" width="50" height="50"/>
                                </Pin>
                            </AdvancedMarker>
                            {infoWindowOpen && (
                                <InfoWindow
                                    position={{ lat: markerPosition.lat+0.0005, lng: markerPosition.lng }}
                                    maxWidth={200}
                                    headerDisabled={true}
                                >
                                    <div style={{ fontFamily: 'MyCustomFont, sans-serif', fontSize: '16px', fontWeight: 'bold' }}
                                         className="text-center">
                                        원하는 지역에 도달하면 <br/>
                                        아래 버튼을 클릭해주세요!
                                    </div>
                                </InfoWindow>
                            )}
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
                <img
                    src="../src/assets/svg/home.svg"
                    className="w-5 max-w-xs md:max-w-sm lg:max-w-md"
                    alt="Home Icon"
                />

            </button>

            {(!overlayVisible) &&  (
                <button
                    onClick={handleinfoClick}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '80px',
                        zIndex: 1000,
                        backgroundColor: '#fff',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontFamily: 'MyCustomFont, sans-serif',
                    }}
                >
                    안내멘트 다시보기
                </button>
            )}

            <button
                onClick={handleLoadClick}
                className="bg-green-900 text-white items-center"
                style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '45%',
                    zIndex: 999,
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    fontFamily: 'MyCustomFont, sans-serif',
                }}
            >
                위치 결정!
            </button>
        </div>

    );
};
