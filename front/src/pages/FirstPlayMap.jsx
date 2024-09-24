import React, { useEffect, useState, useRef } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
// import { useRecoilValue } from "recoil";
// import { mapAtom } from "../recoil/testAtom";
import { useNavigate } from "react-router-dom";
import Loading from "../assets/loading";
import {userPresenceAtom} from "../recoil/userPresenseAtom.jsx";
import {useSetRecoilState} from "recoil";

function FirstPlayMap(props) {
    const googleMapApi = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const googleMapId = import.meta.env.VITE_APP_GOOGLE_MAPS_ID;
    const navigate = useNavigate();
    const setUserPresence = useSetRecoilState(userPresenceAtom);

    // const mapData = useRecoilValue(mapAtom);
    const [roomData, setRoomData] = useState([]);
    const [mapKey, setMapKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);  // Set initial loading state to true
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null); // New state for selected room
    const mapRef = useRef(null);

    const pinColors = ["#FFBB00", "#FF5733", "#33FF57", "#3357FF", "#FF33A6"];

    const getRandomColor = () => {
        return pinColors[Math.floor(Math.random() * pinColors.length)];
    };

    const handleHomeClick = () => {
        navigate('/main');
    };

    const handlePinClick = (room) => {
        console.log('Pin clicked for room:', room);
        setSelectedRoom(room); // Store the selected room
        setIsModalOpen(true);
    };

    useEffect(() => {
        setMapKey((prevKey) => prevKey + 1);
    }, []);

    useEffect(() => {
        // Fetch room data from the server
        fetch('/api/rooms', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies if necessary
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch room data');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched room data:', data);
                setRoomData(data);
                setIsLoading(false); // Data has been loaded
            })
            .catch(error => {
                console.error('Error fetching room data:', error);
                setIsLoading(false); // Stop loading even if there's an error
            });
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            const mapInstance = mapRef.current;

            // Google Maps tilesloaded event listener
            mapInstance.addListener('tilesloaded', () => {
                console.log('Tiles have been loaded');
                setIsLoading(false);  // Tiles are loaded
            });
        }
    }, [mapRef.current]);

    const handleJoinRoom = () => {
        if (selectedRoom) {
            // Verify the room's location before proceeding
            fetch(`/api/room/${selectedRoom.id}/verify-location?latitude=${selectedRoom.roomLocationLatitude}&longitude=${selectedRoom.roomLocationLongitude}`)
                .then(response => response.json())
                .then(data => {
                    if (data.roomExists) {
                        // If room exists, store the roomId in userPresenceAtom
                        setUserPresence(prev => ({
                            ...prev,
                            roomId: selectedRoom.id, // Set the room ID
                        }));

                        // Navigate to WaitingPage
                        navigate(`/main/secondPlay/wait/${selectedRoom.id}`, { state: { room: selectedRoom } });
                        setIsModalOpen(false);
                    } else {
                        alert(data.message); // Room doesn't exist
                    }
                })
                .catch(error => {
                    console.error('Error verifying room location:', error);
                    alert("There was an error verifying the room location.");
                    window.location.reload();
                });
        }
    };

    return (
        <div style={{ maxWidth: '100vw', height: '100vh', margin: 'auto' }}>
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <h2>로딩중...</h2>
                    <Loading />
                </div>
            ) : (
                <APIProvider apiKey={googleMapApi}>
                    <div style={{ height: '100%', width: '100%' }}>
                        {roomData && roomData.length > 0 && (
                            <Map
                                ref={mapRef}
                                key={mapKey}
                                defaultZoom={10}
                                defaultCenter={{ lat: 37.5665, lng: 126.9780 }}
                                mapId={googleMapId}
                                options={{
                                    mapTypeControl: false,
                                }}
                            >
                                {roomData.map((room, index) => {
                                    const color = getRandomColor();
                                    return (
                                        <AdvancedMarker
                                            key={index}
                                            position={{
                                                lat: room.roomLocationLatitude,
                                                lng: room.roomLocationLongitude,
                                            }}
                                            onClick={() => handlePinClick(room)}
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
            )}

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
            <button
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "80px",
                    backgroundColor: "yellow",
                    border: "solid"
                }}
                onClick={() => window.location.reload()}
            >
                새로고침
            </button>

            {/* Modal Window */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white text-center p-8 rounded-lg max-w-lg w-full"
                         style={{ fontFamily: 'MyCustomFont, sans-serif' }}>
                        <h1 className="text-2xl font-bold mb-4">게임신청</h1>
                        <h3>사용자님에게 게임을 신청하시겠습니까?</h3>
                        <button
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full"
                            onClick={handleJoinRoom} // Modified here
                        >
                            예
                        </button>
                        <button
                            className="mt-4 px-4 py-2 text-green-500 rounded-full"
                            onClick={()=>{navigate('/main/firstPlay'); setIsModalOpen(false)}}

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
