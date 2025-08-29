// MongoDB initialization script
db = db.getSiblingDB('fleetlink');

// Create collections
db.createCollection('vehicles');
db.createCollection('bookings');

// Create indexes for better performance
db.vehicles.createIndex({ "capacityKg": 1 });
db.vehicles.createIndex({ "isActive": 1 });
db.vehicles.createIndex({ "capacityKg": 1, "isActive": 1 });

db.bookings.createIndex({ "vehicleId": 1, "startTime": 1, "endTime": 1 });
db.bookings.createIndex({ "startTime": 1, "endTime": 1 });
db.bookings.createIndex({ "customerId": 1 });

// Insert sample vehicles
db.vehicles.insertMany([
  {
    name: "Heavy Duty Truck 001",
    capacityKg: 5000,
    tyres: 6,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Medium Cargo Van 002",
    capacityKg: 2000,
    tyres: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Light Delivery Truck 003",
    capacityKg: 1000,
    tyres: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('MongoDB initialized successfully!');
