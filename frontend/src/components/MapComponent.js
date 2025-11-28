import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom disaster icons
const createDisasterIcon = (type, severity) => {
  const colors = {
    critical: '#dc2626',
    high: '#ef4444', 
    medium: '#f59e0b',
    low: '#22c55e'
  };
  
  const icons = {
    earthquake: '🏚️',
    flood: '🌊',
    fire: '🔥',
    cyclone: '🌀',
    landslide: '⛰️',
    tsunami: '🌊'
  };
  
  return L.divIcon({
    html: `<div style="background: ${colors[severity]}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${icons[type] || '⚠️'}</div>`,
    className: 'custom-disaster-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const MapComponent = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
    
    // Real-time updates
    const socket = io('http://localhost:5000');
    socket.on('newAlerts', (newAlerts) => {
      setAlerts(newAlerts);
    });
    
    return () => socket.disconnect();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts?limit=50');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: '#22c55e',
      medium: '#f59e0b', 
      high: '#ef4444',
      critical: '#dc2626'
    };
    return colors[severity] || '#6b7280';
  };

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} className="leaflet-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {alerts.map((alert) => (
        alert.location.coordinates && (
          <Marker
            key={alert._id}
            position={[alert.location.coordinates[1], alert.location.coordinates[0]]}
            icon={createDisasterIcon(alert.type, alert.severity)}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h5 style={{ color: getSeverityColor(alert.severity), marginBottom: '8px' }}>
                  {alert.type.toUpperCase()}
                </h5>
                <p><strong>Severity:</strong> <span style={{ color: getSeverityColor(alert.severity) }}>{alert.severity.toUpperCase()}</span></p>
                <p><strong>Location:</strong> {alert.location.address}</p>
                {alert.magnitude && <p><strong>Magnitude:</strong> {alert.magnitude}</p>}
                <p><strong>Description:</strong> {alert.description}</p>
                <p><strong>Source:</strong> {alert.source}</p>
                <small style={{ color: '#666' }}>
                  {new Date(alert.createdAt).toLocaleString()}
                </small>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default MapComponent;