/**
 * Check if two time ranges overlap
 */
export const checkTimeOverlap = (start1, end1, start2, end2) => {
  const startTime1 = new Date(start1);
  const endTime1 = new Date(end1);
  const startTime2 = new Date(start2);
  const endTime2 = new Date(end2);
  
  // Two ranges overlap if one starts before the other ends
  return startTime1 < endTime2 && startTime2 < endTime1;
};

/**
 * Find vehicles that have overlapping bookings in the specified time window
 */
export const findVehiclesWithOverlappingBookings = async (Booking, startTime, endTime) => {
  const overlappingBookings = await Booking.find({
    $or: [
      {
        // Existing booking starts before new booking ends AND
        // Existing booking ends after new booking starts
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ],
    status: { $in: ['confirmed'] } // Only consider active bookings
  }).select('vehicleId');
  
  // Return array of vehicle IDs that have overlapping bookings
  return overlappingBookings.map(booking => booking.vehicleId.toString());
};