'use client';

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { District } from '@/app/map/page';

interface DetailedMapProps {
  districts: District[];
  selectedDistrict: District | null;
  onSelectDistrict: (d: District) => void;
}

export default function DetailedMap({ districts, selectedDistrict, onSelectDistrict }: DetailedMapProps) {
  // Center roughly on Maharashtra: [19.7515, 75.7139]
  return (
    <MapContainer 
      center={[19.7515, 75.7139]} 
      zoom={6.5} 
      style={{ height: '100%', width: '100%', borderRadius: '16px' }} 
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {districts.map(d => (
        <CircleMarker
          key={d.id}
          center={[d.lat, d.lng]}
          radius={selectedDistrict?.id === d.id ? 14 : 9}
          pathOptions={{ 
            color: d.risk === 'critical' ? '#B34E4E' : d.risk === 'warning' ? '#D99A45' : '#4E6E58',
            fillColor: d.risk === 'critical' ? '#B34E4E' : d.risk === 'warning' ? '#D99A45' : '#4E6E58',
            fillOpacity: 0.8,
            weight: selectedDistrict?.id === d.id ? 4 : 2
          }}
          eventHandlers={{
            click: () => onSelectDistrict(d)
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'var(--font-inter)', textAlign: 'center' }}>
              <strong style={{ fontSize: '14px', color: '#1A2F24' }}>{d.name}</strong><br/>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 700,
                color: d.risk === 'critical' ? '#B34E4E' : d.risk === 'warning' ? '#D99A45' : '#4E6E58'
              }}>
                {d.risk.toUpperCase()}
              </span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
