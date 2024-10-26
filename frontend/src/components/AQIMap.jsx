// src/components/AQIMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AQIMap = ({ city }) => {
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAQIData = async () => {
      if (!city) return; // Exit if city is not provided

      try {
        const response = await fetch(
          `https://api.waqi.info/feed/${city}/?token=f3b9be0df1219ec400db7f73f2c506ac61c553cb`
        );
        const data = await response.json();
        if (data.status === 'ok') {
          setAqiData(data.data);
        } else {
          setError('Unable to fetch AQI data for this location.');
        }
      } catch (error) {
        setError('An error occurred while fetching the AQI data.');
      }
    };

    fetchAQIData();
  }, [city]); // Depend on city prop

  return (
    <div className="h-screen">
      {error && <p>{error}</p>}
      {aqiData && (
        <MapContainer
          center={[aqiData.city.geo[0], aqiData.city.geo[1]]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[aqiData.city.geo[0], aqiData.city.geo[1]]}>
            <Popup>
              <div>
                <h3>{aqiData.city.name}</h3>
                <p>AQI: {aqiData.aqi}</p>
                <p>PM2.5: {aqiData.iaqi.pm25?.v}</p>
                <p>PM10: {aqiData.iaqi.pm10?.v}</p>
                <p>Ozone (O3): {aqiData.iaqi.o3?.v}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default AQIMap;
