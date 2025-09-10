
import React, { useContext } from 'react';
import { View, UserRole } from '../types';
import { AppContext } from '../App';
import { PlaneIcon } from './icons/PlaneIcon';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const context = useContext(AppContext);

  const getButtonClass = (view: View) => {
    return currentView === view
      ? 'bg-blue-500 text-white'
      : 'bg-gray-700 hover:bg-gray-600';
  };

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 p-4 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center gap-3">
        <PlaneIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-xl md:text-2xl font-bold text-gray-100 tracking-wider">
          Airline Flight Status
        </h1>
      </div>
      <nav className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setView(View.Passenger)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${getButtonClass(View.Passenger)}`}
        >
          Passenger
        </button>
        <button
          onClick={() => {
            if (context?.userRole === UserRole.Admin) {
              setView(View.Admin);
            } else {
              context?.login(); // Simplified: directly logs in
            }
          }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${getButtonClass(View.Admin)}`}
        >
          Admin
        </button>
      </nav>
    </header>
  );
};

export default Header;
