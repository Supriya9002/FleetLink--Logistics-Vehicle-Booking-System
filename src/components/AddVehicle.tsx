import React, { useState } from 'react';
import { Truck, Plus, Check, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

interface FormData {
  name: string;
  capacityKg: string;
  tyres: string;
}

interface AddVehicleProps {
  onVehicleAdded?: () => void;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ onVehicleAdded }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    capacityKg: '',
    tyres: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.capacityKg || !formData.tyres) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const vehicleData = {
        name: formData.name,
        capacityKg: parseInt(formData.capacityKg),
        tyres: parseInt(formData.tyres)
      };

      await apiService.createVehicle(vehicleData);
      
      setMessage({ type: 'success', text: 'Vehicle added successfully!' });
      setFormData({ name: '', capacityKg: '', tyres: '' });
      
      if (onVehicleAdded) {
        onVehicleAdded();
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to add vehicle'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Truck className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
          <p className="text-gray-600">Register a new vehicle to your fleet</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Vehicle Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., Heavy Duty Truck 001"
            disabled={loading}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="capacityKg" className="block text-sm font-semibold text-gray-700 mb-2">
              Capacity (KG)
            </label>
            <input
              type="number"
              id="capacityKg"
              name="capacityKg"
              value={formData.capacityKg}
              onChange={handleInputChange}
              min="1"
              max="50000"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., 5000"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="tyres" className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Tyres
            </label>
            <input
              type="number"
              id="tyres"
              name="tyres"
              value={formData.tyres}
              onChange={handleInputChange}
              min="2"
              max="18"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., 6"
              disabled={loading}
            />
          </div>
        </div>

        {message && (
          <div className={`flex items-center gap-2 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding Vehicle...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Vehicle
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;