import { calculateRideDuration, calculateEndTime } from '../utils/rideCalculation.js';
import { checkTimeOverlap } from '../utils/overlapDetection.js';

describe('Utility Functions', () => {
  describe('calculateRideDuration', () => {
    it('should calculate duration correctly for different pincodes', () => {
      expect(calculateRideDuration('123456', '123458')).toBe(2);
      expect(calculateRideDuration('100000', '100010')).toBe(10);
      expect(calculateRideDuration('999999', '000001')).toBe(22); // (999998 % 24)
    });

    it('should return minimum 1 hour for same pincodes', () => {
      expect(calculateRideDuration('123456', '123456')).toBe(1);
    });

    it('should handle reverse direction correctly', () => {
      expect(calculateRideDuration('654321', '123456')).toBe(23); // Same as abs difference
    });

    it('should throw error for invalid pincodes', () => {
      expect(() => calculateRideDuration('invalid', '123456')).toThrow();
      expect(() => calculateRideDuration('123456', 'invalid')).toThrow();
    });
  });

  describe('calculateEndTime', () => {
    it('should add duration hours to start time', () => {
      const startTime = '2024-12-15T10:00:00Z';
      const duration = 5;
      
      const endTime = calculateEndTime(startTime, duration);
      const expectedEndTime = new Date('2024-12-15T15:00:00Z');
      
      expect(endTime.getTime()).toBe(expectedEndTime.getTime());
    });
  });

  describe('checkTimeOverlap', () => {
    it('should detect overlapping time ranges', () => {
      const start1 = '2024-12-15T10:00:00Z';
      const end1 = '2024-12-15T15:00:00Z';
      const start2 = '2024-12-15T12:00:00Z';
      const end2 = '2024-12-15T17:00:00Z';
      
      expect(checkTimeOverlap(start1, end1, start2, end2)).toBe(true);
    });

    it('should detect no overlap for non-overlapping ranges', () => {
      const start1 = '2024-12-15T10:00:00Z';
      const end1 = '2024-12-15T15:00:00Z';
      const start2 = '2024-12-15T16:00:00Z';
      const end2 = '2024-12-15T20:00:00Z';
      
      expect(checkTimeOverlap(start1, end1, start2, end2)).toBe(false);
    });

    it('should handle adjacent time ranges as no overlap', () => {
      const start1 = '2024-12-15T10:00:00Z';
      const end1 = '2024-12-15T15:00:00Z';
      const start2 = '2024-12-15T15:00:00Z';
      const end2 = '2024-12-15T20:00:00Z';
      
      expect(checkTimeOverlap(start1, end1, start2, end2)).toBe(false);
    });
  });
});