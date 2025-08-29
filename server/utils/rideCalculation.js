/**
 * Calculate estimated ride duration based on pincode difference
 * This is a simplified logic for demonstration purposes
 * In production, this would integrate with actual routing services
 */
export const calculateRideDuration = (fromPincode, toPincode) => {
  const from = parseInt(fromPincode);
  const to = parseInt(toPincode);
  
  if (isNaN(from) || isNaN(to)) {
    throw new Error('Invalid pincode format');
  }
  
  // Simplified calculation: absolute difference modulo 24 hours
  const duration = Math.abs(from - to) % 24;
  
  // Ensure minimum duration of 1 hour
  return Math.max(duration, 1);
};

/**
 * Calculate end time based on start time and duration
 */
export const calculateEndTime = (startTime, durationHours) => {
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + durationHours);
  return endTime;
};