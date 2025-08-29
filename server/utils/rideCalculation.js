/**
 * Calculate estimated ride duration based on pincode difference
 * Simplified logic as per assignment requirements
 * Note: This is a highly simplified placeholder logic
 */
export const calculateRideDuration = (fromPincode, toPincode) => {
  const from = parseInt(fromPincode);
  const to = parseInt(toPincode);
  
  if (isNaN(from) || isNaN(to)) {
    throw new Error('Invalid pincode format');
  }
  
  // Simplified calculation as per assignment requirements:
  // estimatedRideDurationHours = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24
  const pincodeDifference = Math.abs(from - to);
  const estimatedRideDurationHours = pincodeDifference % 24;
  
  // Ensure minimum duration of 1 hour
  return Math.max(1, estimatedRideDurationHours);
};

/**
 * Calculate end time based on start time and duration
 */
export const calculateEndTime = (startTime, durationHours) => {
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + durationHours);
  return endTime;
};