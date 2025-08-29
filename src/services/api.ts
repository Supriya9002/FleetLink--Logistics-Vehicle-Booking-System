import { Vehicle, Booking, SearchCriteria, ApiResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Vehicle APIs
  async createVehicle(vehicleData: Omit<Vehicle, '_id' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Vehicle>> {
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async getAllVehicles(): Promise<ApiResponse<Vehicle[]>> {
    return this.request('/vehicles');
  }

  async getAvailableVehicles(criteria: SearchCriteria): Promise<ApiResponse<Vehicle[]>> {
    const queryParams = new URLSearchParams({
      capacityRequired: criteria.capacityRequired.toString(),
      fromPincode: criteria.fromPincode,
      toPincode: criteria.toPincode,
      startTime: criteria.startTime,
    });

    return this.request(`/vehicles/available?${queryParams}`);
  }

  // Booking APIs
  async createBooking(bookingData: {
    vehicleId: string;
    customerId: string;
    fromPincode: string;
    toPincode: string;
    startTime: string;
  }): Promise<ApiResponse<Booking>> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request('/bookings');
  }

  async cancelBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.request(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();