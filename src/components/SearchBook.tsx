import React, { useState } from 'react';
import { Search, Calendar, MapPin, Package, Clock, CheckCircle, AlertCircle, Truck } from 'lucide-react';
import apiService from '../services/api';
import { Vehicle, SearchCriteria } from '../types';

interface SearchBookProps {
  onBookingCreated?: () => void;
}

const SearchBook: React.FC<SearchBookProps> = ({ onBookingCreated }) => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    capacityRequired: 0,
    fromPincode: '',
    toPincode: '',
    startTime: ''
  });
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: name === 'capacityRequired' ? parseInt(value) || 0 : value
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchCriteria.capacityRequired || !searchCriteria.fromPincode || 
        !searchCriteria.toPincode || !searchCriteria.startTime) {
      setMessage({ type: 'error', text: 'Please fill in all search criteria' });
      return;
    }

    setSearchLoading(true);
    setMessage(null);
    setAvailableVehicles([]);
    setSearchResults(null);

    try {
      const response = await apiService.getAvailableVehicles(searchCriteria);
      setAvailableVehicles(response.data);
      setSearchResults(response.searchCriteria);
      
      setMessage({ 
        type: 'success', 
        text: `Found ${response.data.length} available vehicle${response.data.length !== 1 ? 's' : ''}` 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to search vehicles'
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleBookVehicle = async (vehicleId: string) => {
    setBookingLoading(vehicleId);
    setMessage(null);

    try {
      const bookingData = {
        vehicleId,
        customerId: 'demo-customer-001', // Hardcoded for demo
        fromPincode: searchCriteria.fromPincode,
        toPincode: searchCriteria.toPincode,
        startTime: searchCriteria.startTime
      };

      await apiService.createBooking(bookingData);
      
      setMessage({ type: 'success', text: 'Vehicle booked successfully!' });
      
      // Remove booked vehicle from available list
      setAvailableVehicles(prev => prev.filter(v => v._id !== vehicleId));
      
      if (onBookingCreated) {
        onBookingCreated();
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to book vehicle'
      });
    } finally {
      setBookingLoading(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-orange-100 p-3 rounded-lg">
            <Search className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Search & Book Vehicles</h2>
            <p className="text-gray-600">Find available vehicles for your logistics needs</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="capacityRequired" className="block text-sm font-semibold text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Capacity Required (KG)
              </label>
              <input
                type="number"
                id="capacityRequired"
                name="capacityRequired"
                value={searchCriteria.capacityRequired || ''}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 500"
                disabled={searchLoading}
              />
            </div>

            <div>
              <label htmlFor="fromPincode" className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                From Pincode
              </label>
              <input
                type="text"
                id="fromPincode"
                name="fromPincode"
                value={searchCriteria.fromPincode}
                onChange={handleInputChange}
                pattern="\d{6}"
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="123456"
                disabled={searchLoading}
              />
            </div>

            <div>
              <label htmlFor="toPincode" className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                To Pincode
              </label>
              <input
                type="text"
                id="toPincode"
                name="toPincode"
                value={searchCriteria.toPincode}
                onChange={handleInputChange}
                pattern="\d{6}"
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="654321"
                disabled={searchLoading}
              />
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={searchCriteria.startTime ? searchCriteria.startTime.slice(0, 16) : ''}
                onChange={(e) => setSearchCriteria(prev => ({
                  ...prev,
                  startTime: new Date(e.target.value).toISOString()
                }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                disabled={searchLoading}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={searchLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {searchLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Available Vehicles
              </>
            )}
          </button>
        </form>
      </div>

      {/* Messages */}
      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Search Results */}
      {searchResults && availableVehicles.length === 0 && !searchLoading && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Truck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Vehicles Available</h3>
          <p className="text-gray-500">No vehicles meet your criteria for the selected time slot. Try adjusting your search parameters.</p>
        </div>
      )}

      {/* Available Vehicles */}
      {availableVehicles.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold text-gray-900">Available Vehicles</h3>
            {searchResults && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {availableVehicles.length} results
              </span>
            )}
          </div>

          {searchResults && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Search Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Capacity:</span>
                  <div className="text-blue-900">{searchResults.capacityRequired} KG</div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Route:</span>
                  <div className="text-blue-900">{searchResults.fromPincode} → {searchResults.toPincode}</div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Start Time:</span>
                  <div className="text-blue-900">{formatDateTime(searchResults.startTime)}</div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Duration:</span>
                  <div className="text-blue-900">{searchResults.estimatedRideDurationHours}h</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6">
            {availableVehicles.map((vehicle) => (
              <div key={vehicle._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{vehicle.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {vehicle.capacityKg.toLocaleString()} KG
                          </span>
                          <span>{vehicle.tyres} Tyres</span>
                        </div>
                      </div>
                    </div>

                    {vehicle.estimatedRideDurationHours && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>Estimated Duration: <strong>{vehicle.estimatedRideDurationHours} hour{vehicle.estimatedRideDurationHours !== 1 ? 's' : ''}</strong></span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleBookVehicle(vehicle._id)}
                    disabled={bookingLoading === vehicle._id}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 min-w-[140px]"
                  >
                    {bookingLoading === vehicle._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Book Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBook;