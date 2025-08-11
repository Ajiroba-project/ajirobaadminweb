'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
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

const MapComponent = ({ locationData = {} }) => {
    return (
        <MapContainer
            center={[9.0820, 8.6753]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {Object.entries(locationData).map(([state, count]) => {
                const coordinates = stateCoordinates[state];
                if (!coordinates) return null;

                return (
                    <Marker
                        key={state}
                        position={coordinates}
                        icon={icon}
                    >
                        <Popup>
                            <strong>{state}</strong>: {count} customer{count !== 1 ? 's' : ''}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MapComponent;