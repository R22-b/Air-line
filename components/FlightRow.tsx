
import React, { useContext } from 'react';
import { Flight, FlightStatus, UserRole } from '../types';
import { AppContext } from '../App';

interface FlightRowProps {
  flight: Flight;
  onEdit?: (flight: Flight) => void;
  onDelete?: (id: string) => void;
}

const statusStyles: Record<FlightStatus, string> = {
  [FlightStatus.OnTime]: 'bg-green-500/20 text-green-300',
  [FlightStatus.Boarding]: 'bg-blue-500/20 text-blue-300 animate-pulse',
  [FlightStatus.Delayed]: 'bg-yellow-500/20 text-yellow-300',
  [FlightStatus.Cancelled]: 'bg-red-500/20 text-red-300',
  [FlightStatus.Departed]: 'bg-gray-500/20 text-gray-400',
};

const FlightRow: React.FC<FlightRowProps> = ({ flight, onEdit, onDelete }) => {
  const context = useContext(AppContext);
  const isAdmin = context?.userRole === UserRole.Admin;

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200 font-mono">
      <td className="p-4 font-bold text-lg text-white">{flight.flightNumber}</td>
      <td className="p-4 text-gray-300">{flight.source}</td>
      <td className="p-4 text-gray-300">{flight.destination}</td>
      <td className="p-4 text-lg text-cyan-300">{flight.departureTime}</td>
      <td className="p-4 text-gray-300">{flight.terminal}</td>
      <td className="p-4 text-gray-300">{flight.gate}</td>
      <td className="p-4 text-center">
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[flight.status]}`}>
          {flight.status}
        </span>
      </td>
      {isAdmin && onEdit && onDelete && (
        <td className="p-4 text-center">
          <div className="flex justify-center gap-3">
            <button onClick={() => onEdit(flight)} className="text-blue-400 hover:text-blue-300">Edit</button>
            <button onClick={() => onDelete(flight.id)} className="text-red-400 hover:text-red-300">Delete</button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default FlightRow;
