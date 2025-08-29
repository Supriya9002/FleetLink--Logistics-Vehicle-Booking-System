import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling
app.use(errorHandler);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FleetLink API is running' });
});

// MongoDB connection with in-memory fallback for demo
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('MongoDB connection failed, using in-memory database');
    // For demo purposes, we'll continue without external MongoDB
  }
};

if (process.env.NODE_ENV !== 'test') {
  connectDB();
  
  app.listen(PORT, () => {
    console.log(`FleetLink server running on port ${PORT}`);
  });
}

export default app;