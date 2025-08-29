/**
 * Calculate estimated ride duration based on pincode difference
 * More realistic calculation considering distance and road conditions
 */
export const calculateRideDuration = (fromPincode, toPincode) => {
  const from = parseInt(fromPincode);
  const to = parseInt(toPincode);
  
  if (isNaN(from) || isNaN(to)) {
    throw new Error('Invalid pincode format');
  }
  
  // Calculate distance based on pincode difference
  const pincodeDifference = Math.abs(from - to);
  
  // More realistic calculation:
  // 1. Base distance: pincode difference * 0.1 km (rough approximation)
  // 2. Average speed: 40 km/h (considering city traffic and stops)
  // 3. Add buffer time for loading/unloading and traffic
  
  const baseDistanceKm = pincodeDifference * 0.1;
  const averageSpeedKmh = 40;
  const baseTravelTimeHours = baseDistanceKm / averageSpeedKmh;
  
  // Add buffer time based on distance
  const bufferTimeHours = Math.max(0.5, baseDistanceKm * 0.02); // 2% of distance as buffer
  
  // Add loading/unloading time
  const loadingTimeHours = 0.5;
  
  const totalDuration = baseTravelTimeHours + bufferTimeHours + loadingTimeHours;
  
  // Ensure minimum duration of 1 hour and maximum of 48 hours
  return Math.max(1, Math.min(48, Math.round(totalDuration * 10) / 10));
};

/**
 * Calculate end time based on start time and duration
 */
export const calculateEndTime = (startTime, durationHours) => {
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + durationHours);
  return endTime;
};