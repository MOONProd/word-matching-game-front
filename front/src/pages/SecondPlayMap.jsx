import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useRecoilValue } from "recoil";
import { SeoulAtom } from "../recoil/SeoulAtom";
import { useNavigate } from "react-router-dom";

export const SecondPlayMap = () => {
    const googleMapApi = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const googleMapId = import.meta.env.VITE_APP_GOOGLE_MAPS_ID;
    const navigate = useNavigate();

    const seoulLocal = useRecoilValue(SeoulAtom);
    const [mapKey, setMapKey] = useState(0);
    const [markerPosition, setMarkerPosition] = useState({ lat: seoulLocal.lat, lng: seoulLocal.long });
    
    const [infoWindowOpen, setInfoWindowOpen] = useState(true);

    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1);
    }, [seoulLocal]);

    const handleMarkerDragStart = (event) => {
        console.log("Drag started", event.latLng.lat(), event.latLng.lng());
    };

    const handleMarkerDrag = (event) => {
        console.log("Dragging", event.latLng.lat(), event.latLng.lng());
        setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    };

    const handleMarkerDragEnd = (event) => {
        console.log("Drag ended", event.latLng.lat(), event.latLng.lng());
        setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    };

    const handleHomeClick = ()=>{
        navigate('/');
    };
    

    return (
        <div style={{ maxWidth: '100vw', height: '100vh', margin: 'auto' }}>
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
                            }}
                        >
                            <AdvancedMarker
                                key={mapKey}
                                position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                                
                                draggable={true} // 드래그 가능 설정
                                onDragStart={handleMarkerDragStart}
                                onDrag={handleMarkerDrag}
                                onDragEnd={handleMarkerDragEnd}
                            >
                                <Pin scale={3} 
                                     background={"#FFBB00"}
                                     borderColor={"#FFBB00"}>
                                    <img src="../src/assets/images/gaguli.png" width="50" height="50"/>
                                </Pin>
                            </AdvancedMarker>
                            {infoWindowOpen && (
                                <InfoWindow
                                    position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                                    maxWidth={200}
                                    onCloseClick={() => setInfoWindowOpen(false)}>
                                    게임을 하고자 하는 지역으로 드래그 해주세요.
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
        </div>
    );
};
