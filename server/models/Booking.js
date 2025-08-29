import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle ID is required']
  },
  customerId: {
    type: String,
    required: [true, 'Customer ID is required'],
    trim: true
  },
  fromPincode: {
    type: String,
    required: [true, 'From pincode is required'],
    match: [/^\d{6}$/, 'Pincode must be exactly 6 digits']
  },
  toPincode: {
    type: String,
    required: [true, 'To pincode is required'],
    match: [/^\d{6}$/, 'Pincode must be exactly 6 digits']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  estimatedRideDurationHours: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
bookingSchema.index({ vehicleId: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ startTime: 1, endTime: 1 });
bookingSchema.index({ customerId: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;