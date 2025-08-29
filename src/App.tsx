import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import Navigation from './components/Navigation';
import AddVehicle from './components/AddVehicle';
import SearchBook from './components/SearchBook';
import BookingHistory from './components/BookingHistory';

function App() {
  const [activeTab, setActiveTab] = useState<'add' | 'search' | 'bookings'>('search');

  const handleTabChange = (tab: 'add' | 'search' | 'bookings') => {
    setActiveTab(tab);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'add':
        return <AddVehicle onVehicleAdded={() => {}} />;
      case 'search':
        return <SearchBook onBookingCreated={() => setActiveTab('bookings')} />;
      case 'bookings':
        return <BookingHistory />;
      default:
        return <SearchBook onBookingCreated={() => setActiveTab('bookings')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FleetLink</h1>
              <p className="text-gray-600">Logistics Vehicle Booking System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
          {renderActiveComponent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Truck className="w-5 h-5" />
            <span className="font-semibold">FleetLink</span>
          </div>
          <p className="text-gray-400 text-sm">Professional Logistics Management Platform</p>
        </div>
      </footer>
    </div>
  );
}

export default App;