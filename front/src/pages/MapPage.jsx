import React, { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../recoil/testAtom";

export const MapPage = () => {
    const googleMapApi = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const googleMapId = import.meta.env.VITE_APP_GOOGLE_MAPS_ID;

    const mapData = useRecoilValue(mapAtom);
    const [openInfoWindowId, setOpenInfoWindowId] = useState(null);
    const [mapKey, setMapKey] = useState(0);
    const [markerPosition, setMarkerPosition] = useState({ lat: 37.5665, lng: 126.9780 });

    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1);
    }, [mapData]);

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


    return (
        <div style={{ maxWidth: '1000px', height: '600px', margin: 'auto' }}>
            <APIProvider apiKey={googleMapApi}>
                <div style={{ height: '100%', width: '100%' }}>
                    {mapData && (
                        <Map
                            key={mapKey}
                            defaultZoom={18}
                            defaultCenter={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                            mapId={googleMapId}
                        >
                            <AdvancedMarker
                                key={mapKey}
                                position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                                onClick={() => setOpenInfoWindowId(mapKey)}
                                draggable={true} // 드래그 가능 설정
                                onDragStart={handleMarkerDragStart}
                                onDrag={handleMarkerDrag}
                                onDragEnd={handleMarkerDragEnd}
                            >
                                <Pin scale={3} background={"#FFBB00"} />
                            </AdvancedMarker>

                            {openInfoWindowId === mapKey && (
                                <InfoWindow
                                    key={mapKey}
                                    position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
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
};
