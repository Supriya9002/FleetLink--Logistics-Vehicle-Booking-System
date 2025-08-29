export interface Vehicle {
  _id: string;
  name: string;
  capacityKg: number;
  tyres: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  estimatedRideDurationHours?: number;
}

export interface Booking {
  _id: string;
  vehicleId: Vehicle | string;
  customerId: string;
  fromPincode: string;
  toPincode: string;
  startTime: string;
  endTime: string;
  estimatedRideDurationHours: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface SearchCriteria {
  capacityRequired: number;
  fromPincode: string;
  toPincode: string;
  startTime: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  searchCriteria?: any;
}