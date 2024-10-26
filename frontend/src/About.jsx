// src/About.jsx
import React from 'react';
import Spline from '@splinetool/react-spline';
import { Link } from 'react-router-dom';


const About = () => {
    return (
        <div className="relative min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-4xl mx-auto relative z-10 bg-white">
      <Link 
        to="/" 
        className="absolute top-4 right-4 text-blue-500 hover:underline"
    >
        Home
        </Link>
        <h1 className="text-4xl font-bold mb-4">About Air Quality Index (AQI)</h1>
        <p className="mb-4 text-lg text-center">
          The Air Quality Index (AQI) is a measure used to communicate how polluted the air currently is or how polluted it is forecast to become. 
          It focuses on health effects that can happen within a few hours or days after breathing polluted air.
        </p>

        <h2 className="text-2xl font-semibold mb-2">AQI Categories</h2>
        <table className="min-w-full bg-white shadow-md rounded mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">AQI Value</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Health Effects</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border">0 - 50</td>
              <td className="py-2 px-4 border">Good</td>
              <td className="py-2 px-4 border">No health effects.</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">51 - 100</td>
              <td className="py-2 px-4 border">Moderate</td>
              <td className="py-2 px-4 border">Air quality is acceptable; however, for some pollutants, there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">101 - 150</td>
              <td className="py-2 px-4 border">Unhealthy for Sensitive Groups</td>
              <td className="py-2 px-4 border">Members of sensitive groups may experience health effects. The general public is not likely to be affected.</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">151 - 200</td>
              <td className="py-2 px-4 border">Unhealthy</td>
              <td className="py-2 px-4 border">Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">201 - 300</td>
              <td className="py-2 px-4 border">Very Unhealthy</td>
              <td className="py-2 px-4 border">Health alert: everyone may experience more serious health effects.</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">301 and above</td>
              <td className="py-2 px-4 border">Hazardous</td>
              <td className="py-2 px-4 border">Health warnings of emergency conditions. The entire population is more likely to be affected.</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-2xl font-semibold mb-2">Common Pollutants</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>PM10:</strong> Particulate matter with a diameter of 10 micrometers or smaller. Can be inhaled and cause health issues.</li>
          <li><strong>PM2.5:</strong> Fine particulate matter that poses health risks due to deep lung penetration.</li>
          <li><strong>Ozone (O3):</strong> A reactive gas that can affect respiratory health, especially in outdoor environments.</li>
          <li><strong>Nitrogen Dioxide (NO2):</strong> A gas that can irritate the lungs and lower resistance to respiratory infections.</li>
          <li><strong>Sulfur Dioxide (SO2):</strong> A gas that can affect breathing and contribute to other respiratory issues.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">Health Advisory</h2>
        <p className="text-lg text-center">
          It is important to monitor the AQI levels and take necessary precautions when the air quality is poor. 
          Sensitive individuals should consider staying indoors during high pollution periods.
        </p>
      </div>

      <div className="absolute inset-0 z-0">
        <Spline
            scene="https://prod.spline.design/1hIsmfOJnjjQxZ93/scene.splinecode"
        />
      </div>
    </div>

    );
};

export default About;
