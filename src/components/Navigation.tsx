import React from 'react';
import { Truck, Search, Plus, Calendar } from 'lucide-react';

interface NavigationProps {
  activeTab: 'add' | 'search' | 'bookings';
  onTabChange: (tab: 'add' | 'search' | 'bookings') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'add' as const, label: 'Add Vehicle', icon: Plus },
    { id: 'search' as const, label: 'Search & Book', icon: Search },
    { id: 'bookings' as const, label: 'Bookings', icon: Calendar }
  ];

  return (
    <nav className="bg-white shadow-sm rounded-xl p-2">
      <div className="flex space-x-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;