'use client';

import React, { useEffect, useState } from 'react';

const SimpleMap = ({ customerByLocation = [] }) => {
    const [locationData, setLocationData] = useState({});

    useEffect(() => {
        if (customerByLocation && customerByLocation.length > 0) {
            // Create a map of state names to counts
            const dataMap = {};

            customerByLocation
                .filter(item => item.state && item.state.trim() !== "") // Filter out empty state names
                .forEach(item => {
                    if (item.state) {
                        // Remove "State" suffix and trim whitespace
                        const stateName = item.state.replace(" State", "").trim();
                        dataMap[stateName] = item.count;
                    }
                });

            // console.log("Processed location data:", dataMap);
            setLocationData(dataMap);
        }
    }, [customerByLocation]);

    // Nigeria state coordinates (approximate)
    const stateCoordinates = {
        'Lagos': { x: 30, y: 70 },
        'Ogun': { x: 25, y: 65 },
        'Edo': { x: 60, y: 60 },
        'Osun': { x: 40, y: 55 },
        'Abia': { x: 75, y: 45 },
        'Adamawa': { x: 85, y: 20 },
        'Ekiti': { x: 45, y: 50 },
        'Akwa Ibom': { x: 80, y: 40 }
    };

    // Find the maximum count for scaling
    const maxCount = Math.max(...Object.values(locationData), 1);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Customer by Location</h2>
            <div className="relative h-[400px] w-full border border-gray-300 rounded-lg overflow-hidden">
                {/* Simple Nigeria map background */}
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                        <p>Nigeria Map</p>
                        <p className="text-xs">(Simplified representation)</p>
                    </div>
                </div>

                {/* State markers */}
                {Object.entries(locationData).map(([state, count]) => {
                    const coords = stateCoordinates[state];
                    if (!coords) return null;

                    // Calculate marker size based on count
                    const size = Math.max(20, Math.min(50, (count / maxCount) * 50));

                    return (
                        <div
                            key={state}
                            className="absolute rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer transition-all hover:bg-blue-600"
                            style={{
                                left: `${coords.x}%`,
                                top: `${coords.y}%`,
                                width: `${size}px`,
                                height: `${size}px`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            title={`${state}: ${count} customer${count !== 1 ? 's' : ''}`}
                        >
                            {count}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4">
                {Object.entries(locationData).map(([state, count]) => (
                    <div key={state} className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                        <span>{state}: {count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimpleMap;