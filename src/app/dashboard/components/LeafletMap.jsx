'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the entire map component with no SSR
const MapWithNoSSR = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => <div className="bg-white p-6 rounded-lg shadow-lg h-[400px] flex items-center justify-center">Loading map...</div>
});

// Nigeria state coordinates (approximate)
const stateCoordinates = {
    'Lagos': [6.5244, 3.3792],
    'Ogun': [6.8178, 3.3417],
    'Edo': [6.3431, 5.6188],
    'Osun': [7.7669, 4.5600],
    'Abia': [5.5320, 7.4860],
    'Adamawa': [9.3265, 12.3984],
    'Ekiti': [7.6233, 5.2209],
    'Akwa Ibom': [5.0078, 7.8498]
};

const LeafletMap = ({ customerByLocation = [] }) => {
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Customer by Location</h2>
            <div style={{ height: '400px', width: '100%' }}>
                <MapWithNoSSR locationData={locationData} />
            </div>
        </div>
    );
};

export default LeafletMap;