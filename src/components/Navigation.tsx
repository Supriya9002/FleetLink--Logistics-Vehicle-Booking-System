import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Truck, Search, Plus, Calendar } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const tabs = [
    { id: 'add', label: 'Add Vehicle', icon: Plus, path: '/add' },
    { id: 'search', label: 'Search & Book', icon: Search, path: '/search' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/bookings' }
  ];

  return (
    <nav className="bg-white shadow-sm rounded-xl p-2">
      <div className="flex space-x-2">
        {tabs.map(({ id, label, icon: Icon, path }) => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) => 
              `flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;