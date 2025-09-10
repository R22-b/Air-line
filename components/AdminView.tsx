
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import FlightList from './FlightList';
import FlightForm from './FlightForm';
import { Flight } from '../types';

const AdminView: React.FC = () => {
  const context = useContext(AppContext);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  if (!context) return null;
  const { userRole, flights, addFlight, updateFlight, deleteFlight, logout } = context;

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setEditingFlight(null);
    setIsFormVisible(true);
  };

  const handleSave = (flightData: Omit<Flight, 'id'> | Flight) => {
    if ('id' in flightData) {
      updateFlight(flightData);
    } else {
      addFlight(flightData);
    }
    setIsFormVisible(false);
    setEditingFlight(null);
  };
  
  const handleCancel = () => {
      setIsFormVisible(false);
      setEditingFlight(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue-300">Admin Dashboard</h2>
        <div className="flex gap-4">
             <button
                onClick={handleAddNew}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Add New Flight
            </button>
            <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Logout
            </button>
        </div>
      </div>
      
      {isFormVisible && (
        <FlightForm
          flight={editingFlight}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <FlightList
        flights={flights}
        onEdit={handleEdit}
        onDelete={deleteFlight}
      />
    </div>
  );
};

export default AdminView;
