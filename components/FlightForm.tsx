
import React, { useState, useEffect } from 'react';
import { Flight, FlightStatus } from '../types';

interface FlightFormProps {
  flight: Flight | null;
  onSave: (flightData: Omit<Flight, 'id'> | Flight) => void;
  onCancel: () => void;
}

const FlightForm: React.FC<FlightFormProps> = ({ flight, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    flightNumber: '',
    source: '',
    destination: '',
    departureTime: '',
    terminal: '',
    gate: '',
    status: FlightStatus.OnTime,
  });

  useEffect(() => {
    if (flight) {
      setFormData(flight);
    } else {
      setFormData({
        flightNumber: '',
        source: '',
        destination: '',
        departureTime: '',
        terminal: '',
        gate: '',
        status: FlightStatus.OnTime,
      });
    }
  }, [flight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flight) {
      onSave({ ...formData, id: flight.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-blue-300">{flight ? 'Edit Flight' : 'Add New Flight'}</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input name="flightNumber" value={formData.flightNumber} onChange={handleChange} placeholder="Flight Number" required className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input name="source" value={formData.source} onChange={handleChange} placeholder="Source" required className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input name="destination" value={formData.destination} onChange={handleChange} placeholder="Destination" required className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input name="departureTime" value={formData.departureTime} onChange={handleChange} placeholder="Time (HH:MM)" type="time" required className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input name="terminal" value={formData.terminal} onChange={handleChange} placeholder="Terminal" required className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input name="gate" value={formData.gate} onChange={handleChange} placeholder="Gate" required className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select name="status" value={formData.status} onChange={handleChange} required className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {Object.values(FlightStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <div className="flex gap-4 items-center md:col-span-2 lg:col-span-1">
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">Save</button>
          <button type="button" onClick={onCancel} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default FlightForm;
