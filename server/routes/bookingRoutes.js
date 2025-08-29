import express from 'express';
import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import { calculateRideDuration, calculateEndTime } from '../utils/rideCalculation.js';
import { findVehiclesWithOverlappingBookings } from '../utils/overlapDetection.js';

const router = express.Router();

// Simple validation middleware
const validateBooking = (req, res, next) => {
  const { vehicleId, customerId, fromPincode, toPincode, startTime } = req.body;
  
  if (!vehicleId || typeof vehicleId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Valid vehicle ID is required'
    });
  }
  
  if (!customerId || typeof customerId !== 'string' || customerId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Customer ID is required'
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

// POST /api/bookings - Book a vehicle
router.post('/', validateBooking, async (req, res, next) => {
  try {
    const { vehicleId, customerId, fromPincode, toPincode, startTime } = req.body;
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || !vehicle.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found or inactive'
      });
    }
    
    // Calculate ride duration and end time
    const estimatedRideDurationHours = calculateRideDuration(fromPincode, toPincode);
    const bookingEndTime = calculateEndTime(startTime, estimatedRideDurationHours);
    
    // Re-verify availability to prevent race conditions
    const busyVehicleIds = await findVehiclesWithOverlappingBookings(
      Booking,
      new Date(startTime),
      bookingEndTime
    );
    
    if (busyVehicleIds.includes(vehicleId)) {
      return res.status(409).json({
        success: false,
        message: 'Vehicle is already booked for the requested time slot'
      });
    }
    
    // Create the booking
    const booking = new Booking({
      vehicleId,
      customerId,
      fromPincode,
      toPincode,
      startTime: new Date(startTime),
      endTime: bookingEndTime,
      estimatedRideDurationHours
    });
    
    const savedBooking = await booking.save();
    
    // Populate vehicle details for response
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('vehicleId', 'name capacityKg tyres');
    
    res.status(201).json({
      success: true,
      message: 'Vehicle booked successfully',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings - Get all bookings
router.get('/', async (req, res, next) => {
  try {
    const { customerId, vehicleId } = req.query;
    
    const filter = {};
    if (customerId) filter.customerId = customerId;
    if (vehicleId) filter.vehicleId = vehicleId;
    
    const bookings = await Booking.find(filter)
      .populate('vehicleId', 'name capacityKg tyres')
      .sort({ startTime: -1 });
    
    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }
    
    // Find and update the booking
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    ).populate('vehicleId', 'name capacityKg tyres');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
});

export default router;