
import React, { useState, useMemo, useContext } from 'react';
import { Flight } from '../types';
import { AppContext } from '../App';
import FlightRow from './FlightRow';

interface FlightListProps {
  flights: Flight[];
  onEdit?: (flight: Flight) => void;
  onDelete?: (id: string) => void;
}

const FlightList: React.FC<FlightListProps> = ({ flights, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const context = useContext(AppContext);

  const filteredFlights = useMemo(() => {
    if (!searchTerm) return flights;
    const lowercasedFilter = searchTerm.toLowerCase();
    return flights.filter(flight =>
      flight.flightNumber.toLowerCase().includes(lowercasedFilter) ||
      flight.source.toLowerCase().includes(lowercasedFilter) ||
      flight.destination.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, flights]);

  return (
    <div className="bg-gray-800/60 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search by flight no, source, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
        </div>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
                <thead className="border-b-2 border-gray-600 text-sm text-gray-400 uppercase tracking-wider">
                    <tr>
                        <th className="p-3">Flight</th>
                        <th className="p-3">Source</th>
                        <th className="p-3">Destination</th>
                        <th className="p-3">Time</th>
                        <th className="p-3">Terminal</th>
                        <th className="p-3">Gate</th>
                        <th className="p-3 text-center">Status</th>
                        {context?.userRole === 1 && <th className="p-3 text-center">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredFlights.length > 0 ? (
                        filteredFlights.map(flight => (
                            <FlightRow key={flight.id} flight={flight} onEdit={onEdit} onDelete={onDelete} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={context?.userRole === 1 ? 8 : 7} className="text-center p-6 text-gray-500">
                                No flights match your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default FlightList;
