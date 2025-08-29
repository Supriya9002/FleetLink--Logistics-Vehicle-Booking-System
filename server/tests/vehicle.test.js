import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Vehicle from '../models/Vehicle.js';

// Test database setup
beforeAll(async () => {
  const url = 'mongodb://127.0.0.1:27017/fleetlink_test';
  await mongoose.connect(url);
});

beforeEach(async () => {
  await Vehicle.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Vehicle API Tests', () => {
  describe('POST /api/vehicles', () => {
    it('should create a new vehicle with valid data', async () => {
      const vehicleData = {
        name: 'Test Truck',
        capacityKg: 1000,
        tyres: 6
      };

      const response = await request(app)
        .post('/api/vehicles')
        .send(vehicleData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(vehicleData.name);
      expect(response.body.data.capacityKg).toBe(vehicleData.capacityKg);
      expect(response.body.data.tyres).toBe(vehicleData.tyres);
    });

    it('should reject vehicle with missing required fields', async () => {
      const invalidData = { name: 'Incomplete Truck' };

      const response = await request(app)
        .post('/api/vehicles')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject vehicle with invalid capacity', async () => {
      const invalidData = {
        name: 'Heavy Truck',
        capacityKg: 60000, // Exceeds max limit
        tyres: 8
      };

      const response = await request(app)
        .post('/api/vehicles')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/vehicles', () => {
    it('should retrieve all active vehicles', async () => {
      // Create test vehicles
      await Vehicle.create([
        { name: 'Truck 1', capacityKg: 1000, tyres: 6 },
        { name: 'Truck 2', capacityKg: 2000, tyres: 8 }
      ]);

      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });
});