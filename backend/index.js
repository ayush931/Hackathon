import express from 'express';
import axios from 'axios';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"]
  }
});

mongoose.connect('mongodb+srv://ayushkumar9315983:111@cluster0.f7sp3.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

const airQualitySchema = new mongoose.Schema({
  city: Object,
  aqi: Number,
  dominantPollutant: String,
  time: Object,
  pollutants: Object,
  timestamp: { type: Date, default: Date.now }
});

const AirQuality = mongoose.model('AirQuality', airQualitySchema);

const AQICN_API_KEY = 'f3b9be0df1219ec400db7f73f2c506ac61c553cb';

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('fetchAirQualityData', async ({ city }) => {
    if (!city) {
      socket.emit('error', 'City name is required');
      return;
    }

    try {
      const response = await axios.get(`https://api.waqi.info/feed/${city}/?token=${AQICN_API_KEY}`);

      if (response.data.status !== 'ok') {
        socket.emit('error', 'City not found');
        return;
      }

      const airQualityData = {
        aqi: response.data.data.aqi,
        city: response.data.data.city,
        dominantPollutant: response.data.data.dominentpol,
        time: response.data.data.time,
        pollutants: {
          PM25: response.data.data.iaqi.pm25 ? response.data.data.iaqi.pm25.v : 'N/A',
          PM10: response.data.data.iaqi.pm10 ? response.data.data.iaqi.pm10.v : 'N/A',
          NO2: response.data.data.iaqi.no2 ? response.data.data.iaqi.no2.v : 'N/A',
          O3: response.data.data.iaqi.o3 ? response.data.data.iaqi.o3.v : 'N/A',
          CO: response.data.data.iaqi.co ? response.data.data.iaqi.co.v : 'N/A',
          SO2: response.data.data.iaqi.so2 ? response.data.data.iaqi.so2.v : 'N/A',
        }
      };

      const newAirQuality = new AirQuality(airQualityData);
      await newAirQuality.save();

      socket.emit('airQualityUpdate', airQualityData);
    } catch (error) {
      console.error(error);
      socket.emit('error', 'Failed to fetch data from AQICN API');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/api/air-quality', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const response = await axios.get(`https://api.waqi.info/feed/${city}/?token=${AQICN_API_KEY}`);

    if (response.data.status !== 'ok') {
      return res.status(404).json({ error: 'City not found' });
    }

    const airQualityData = {
      aqi: response.data.data.aqi,
      city: response.data.data.city,
      dominantPollutant: response.data.data.dominentpol,
      time: response.data.data.time,
      pollutants: {
        PM25: response.data.data.iaqi.pm25 ? response.data.data.iaqi.pm25.v : 'N/A',
        PM10: response.data.data.iaqi.pm10 ? response.data.data.iaqi.pm10.v : 'N/A',
        NO2: response.data.data.iaqi.no2 ? response.data.data.iaqi.no2.v : 'N/A',
        O3: response.data.data.iaqi.o3 ? response.data.data.iaqi.o3.v : 'N/A',
        CO: response.data.data.iaqi.co ? response.data.data.iaqi.co.v : 'N/A',
        SO2: response.data.data.iaqi.so2 ? response.data.data.iaqi.so2.v : 'N/A',
      }
    };

    const newAirQuality = new AirQuality(airQualityData);
    await newAirQuality.save();

    res.json(airQualityData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from AQICN API' });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
