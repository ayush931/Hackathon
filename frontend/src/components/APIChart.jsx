// src/AQIChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AQIChart = ({ aqi }) => {
    const chartData = {
        labels: ['AQI'],
        datasets: [
            {
                label: 'Air Quality Index (AQI)',
                data: [aqi],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="mt-4">
            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
    );
};

export default AQIChart;
