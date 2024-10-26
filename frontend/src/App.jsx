// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import AQIChart from './components/APIChart';
import About from './About';
import AQIMap from './components/AQIMap'; // Import the AQIMap component
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

const socket = io('http://localhost:5173');

const Home = ({ setCity, city, fetchAirQualityData }) => {
    const navigate = useNavigate();

    const handleFetch = async () => {
        if (!city) {
            alert("Please enter a city name.");
            return;
        }
        await fetchAirQualityData(city);
        navigate('/air-quality');
    };

    return (
        <main className="min-h-screen bg-gray-100 relative">
            <div className="spline-wrapper w-full h-full flex justify-center items-center relative">
                <Spline
                    scene="https://prod.spline.design/PYGYArVVHf-sSMOu/scene.splinecode" 
                    className="spline-animation w-full h-full"
                />
                <Link 
                    to="/about" 
                    className="absolute top-4 right-4 text-black-500 hover:underline"
                >
                    About
                </Link>
                <div className="absolute flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl font-bold mb-4 text-center bg-white bg-opacity-75 p-2 rounded">
                        Air Quality Monitoring System
                    </h1>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="p-2 border border-gray-300 rounded mb-4 w-full max-w-md bg-white bg-opacity-75"
                        placeholder="Enter city name"
                    />
                    <button
                        onClick={handleFetch}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Get Air Quality Data
                    </button>
                </div>
            </div>
        </main>
    );
};

const AirQualityData = ({ data, error }) => {
    const aqiLevel = () => {
        if (!data) return 'N/A';
        if (data.aqi <= 50) return 'Good';
        if (data.aqi <= 100) return 'Moderate';
        if (data.aqi <= 150) return 'Unhealthy for Sensitive Groups';
        if (data.aqi <= 200) return 'Unhealthy';
        if (data.aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    };

    return (
        <main className="min-h-screen bg-gray-100 relative">
            <div className="spline-wrapper w-full h-full flex justify-center items-center relative">
                <Spline
                    scene="https://prod.spline.design/yXIYPbU5Ud4dTlfm/scene.splinecode"
                    className="spline-animation w-full h-full"
                />
                <Link 
                    to="/" 
                    className="absolute top-4 right-2 text-blue-500 hover:underline"
                >
                    Home
                </Link>
                <Link 
                    to="/map" 
                    className="absolute top-4 left-2 text-blue-500 hover:underline"
                >
                    View Map
                </Link>
                <div className="absolute flex flex-col items-center justify-center p-4 w-full max-w-md bg-white bg-opacity-75 rounded shadow-md">
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    {data && (
                        <div className="mt-4">
                            <h2 className="text-2xl font-semibold mb-2 text-center">Air Quality in {data?.city?.name || 'Unknown City'}</h2>
                            <p className="font-semibold text-center">AQI: {data.aqi} ({aqiLevel()})</p>
                            <p className="text-gray-500 text-center">Dominant Pollutant: {data.dominantPollutant}</p>
                            <p className="text-gray-500 text-center">Last Updated: {new Date(data.time.s * 1000).toLocaleString()}</p>
                            
                            <h3 className="font-semibold mt-4 text-center">Pollutant Levels:</h3>
                            <ul className="list-disc list-inside text-left">
                                <li>PM2.5: {data.pollutants.PM25} µg/m³</li>
                                <li>PM10: {data.pollutants.PM10} µg/m³</li>
                                <li>NO2: {data.pollutants.NO2} µg/m³</li>
                                <li>O3: {data.pollutants.O3} µg/m³</li>
                                <li>CO: {data.pollutants.CO} µg/m³</li>
                                <li>SO2: {data.pollutants.SO2} µg/m³</li>
                            </ul>

                            <AQIChart aqi={data.aqi} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

const App = () => {
    const [city, setCity] = useState('');
    const [data, setData] = useState(
        localStorage.getItem('airQualityData') ? JSON.parse(localStorage.getItem('airQualityData')) : null
    );
    const [error, setError] = useState('');

    const fetchAirQualityData = async (city) => {
        try {
            const response = await fetch(`http://localhost:4000/api/air-quality?city=${city}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setData(result);
            setError('');
            localStorage.setItem('city', city);
            localStorage.setItem('airQualityData', JSON.stringify(result));
        } catch (err) {
            setError(err.message);
            setData(null);
        }
    };

    useEffect(() => {
        const savedCity = localStorage.getItem('city');
        if (savedCity) {
            setCity(savedCity);
            fetchAirQualityData(savedCity);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home setCity={setCity} city={city} fetchAirQualityData={fetchAirQualityData} />} />
                <Route path="/air-quality" element={<AirQualityData data={data} error={error} />} />
                <Route path="/map" element={<AQIMap city={city} />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
};

export default App;
