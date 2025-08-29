import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import { calculateRideDuration } from '../utils/rideCalculation.js';

beforeAll(async () => {
  const url = 'mongodb://127.0.0.1:27017/fleetlink_test';
  await mongoose.connect(url);
});

beforeEach(async () => {
  await Vehicle.deleteMany({});
  await Booking.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Booking API Tests', () => {
  let testVehicle;

  beforeEach(async () => {
    testVehicle = await Vehicle.create({
      name: 'Test Truck',
      capacityKg: 1000,
      tyres: 6
    });
  });

  describe('POST /api/bookings', () => {
    it('should create a booking for available vehicle', async () => {
      const bookingData = {
        vehicleId: testVehicle._id.toString(),
        customerId: 'customer123',
        fromPincode: '123456',
        toPincode: '654321',
        startTime: '2024-12-15T10:00:00Z'
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.customerId).toBe(bookingData.customerId);
    });

    it('should prevent double booking', async () => {
      const startTime = '2024-12-15T10:00:00Z';
      
      // Create first booking
      const duration = calculateRideDuration('123456', '654321');
      await Booking.create({
        vehicleId: testVehicle._id,
        customerId: 'customer1',
        fromPincode: '123456',
        toPincode: '654321',
        startTime: new Date(startTime),
        endTime: new Date(new Date(startTime).getTime() + duration * 60 * 60 * 1000),
        estimatedRideDurationHours: duration
      });

      // Try to create overlapping booking
      const conflictingBooking = {
        vehicleId: testVehicle._id.toString(),
        customerId: 'customer2',
        fromPincode: '111111',
        toPincode: '222222',
        startTime: '2024-12-15T12:00:00Z' // Overlaps with first booking
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(conflictingBooking);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('should reject booking for non-existent vehicle', async () => {
      const bookingData = {
        vehicleId: new mongoose.Types.ObjectId().toString(),
        customerId: 'customer123',
        fromPincode: '123456',
        toPincode: '654321',
        startTime: '2024-12-15T10:00:00Z'
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/vehicles/available', () => {
    it('should return vehicles with sufficient capacity and no conflicts', async () => {
      const queryParams = {
        capacityRequired: 500,
        fromPincode: '123456',
        toPincode: '654321',
        startTime: '2024-12-15T10:00:00Z'
      };

      const response = await request(app)
        .get('/api/vehicles/available')
        .query(queryParams);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].estimatedRideDurationHours).toBeDefined();
    });

    it('should exclude vehicles with insufficient capacity', async () => {
      const queryParams = {
        capacityRequired: 2000, // Exceeds test vehicle capacity
        fromPincode: '123456',
        toPincode: '654321',
        startTime: '2024-12-15T10:00:00Z'
      };

      const response = await request(app)
        .get('/api/vehicles/available')
        .query(queryParams);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });
});