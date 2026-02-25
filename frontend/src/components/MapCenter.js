import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

const MapCenter = ({ camps }) => {
  const center = camps.length > 0
    ? [camps[0].location.lat, camps[0].location.lng]
    : [26.2006, 92.9376]; // Assam

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {camps.map(camp => {
        const isCritical = camp.priorityScore > 50;
        const criticalItems = camp.inventory?.filter(i => i.status === 'Critical') || [];
        return (
          <CircleMarker
            key={camp._id}
            center={[camp.location.lat, camp.location.lng]}
            radius={isCritical ? 14 : 9}
            pathOptions={{
              color: isCritical ? '#ef4444' : '#22c55e',
              fillColor: isCritical ? '#ef4444' : '#22c55e',
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <strong style={{ fontSize: 14 }}>{camp.name}</strong>
                <div style={{ marginTop: 4, color: isCritical ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                  {isCritical ? '🔴 CRITICAL' : '🟢 Stable'}
                </div>
                <div style={{ marginTop: 4, fontSize: 12 }}>
                  👥 Occupancy: {camp.capacity?.currentOccupancy} / {camp.capacity?.total}
                </div>
                {criticalItems.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: 12, color: '#dc2626' }}>
                    ⚠️ Needs: {criticalItems.map(i => i.item).join(', ')}
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default MapCenter;
