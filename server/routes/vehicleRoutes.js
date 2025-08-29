import express from 'express';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import { calculateRideDuration, calculateEndTime } from '../utils/rideCalculation.js';
import { findVehiclesWithOverlappingBookings } from '../utils/overlapDetection.js';

const router = express.Router();

// Simple validation middleware
const validateVehicle = (req, res, next) => {
  const { name, capacityKg, tyres } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Vehicle name is required'
    });
  }
  
  if (!capacityKg || typeof capacityKg !== 'number' || capacityKg < 1 || capacityKg > 50000) {
    return res.status(400).json({
      success: false,
      message: 'Capacity must be between 1 and 50,000 kg'
    });
  }
  
  if (!tyres || typeof tyres !== 'number' || tyres < 2 || tyres > 18) {
    return res.status(400).json({
      success: false,
      message: 'Tyres must be between 2 and 18'
    });
  }
  
  next();
};

const validateAvailabilityQuery = (req, res, next) => {
  const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
  
  if (!capacityRequired || isNaN(parseInt(capacityRequired)) || parseInt(capacityRequired) < 1) {
    return res.status(400).json({
      success: false,
      message: 'Valid capacity required is needed'
    });
  }
  
  if (!fromPincode || !/^\d{6}$/.test(fromPincode)) {
    return res.status(400).json({
      success: false,
      message: 'From pincode must be exactly 6 digits'
    });
  }
  
  if (!toPincode || !/^\d{6}$/.test(toPincode)) {
    return res.status(400).json({
      success: false,
      message: 'To pincode must be exactly 6 digits'
    });
  }
  
  if (!startTime || isNaN(Date.parse(startTime))) {
    return res.status(400).json({
      success: false,
      message: 'Valid start time is required'
    });
  }
  
  next();
};

// POST /api/vehicles - Add a new vehicle
router.post('/', validateVehicle, async (req, res, next) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    
    const vehicle = new Vehicle({
      name,
      capacityKg,
      tyres
    });
    
    const savedVehicle = await vehicle.save();
    
    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: savedVehicle
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/vehicles/available - Find available vehicles
router.get('/available', validateAvailabilityQuery, async (req, res, next) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    
    // Calculate ride duration and end time
    const estimatedRideDurationHours = calculateRideDuration(fromPincode, toPincode);
    const endTime = calculateEndTime(startTime, estimatedRideDurationHours);
    
    // Find vehicles with sufficient capacity
    const vehiclesWithCapacity = await Vehicle.find({
      capacityKg: { $gte: parseInt(capacityRequired) },
      isActive: true
    });
    
    // Find vehicles with overlapping bookings
    const busyVehicleIds = await findVehiclesWithOverlappingBookings(
      Booking,
      new Date(startTime),
      endTime
    );
    
    // Filter out busy vehicles
    const availableVehicles = vehiclesWithCapacity.filter(
      vehicle => !busyVehicleIds.includes(vehicle._id.toString())
    );
    
    // Add estimated duration to each vehicle
    const vehiclesWithDuration = availableVehicles.map(vehicle => ({
      ...vehicle.toObject(),
      estimatedRideDurationHours
    }));
    
    res.json({
      success: true,
      message: 'Available vehicles retrieved successfully',
      data: vehiclesWithDuration,
      searchCriteria: {
        capacityRequired: parseInt(capacityRequired),
        fromPincode,
        toPincode,
        startTime,
        endTime: endTime.toISOString(),
        estimatedRideDurationHours
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/vehicles - Get all vehicles
router.get('/', async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ isActive: true });
    
    res.json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
});

export default router;