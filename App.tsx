
import React, { useState, useCallback, useMemo } from 'react';
import { Flight, UserRole, View } from './types';
import { INITIAL_FLIGHTS } from './constants';
import Header from './components/Header';
import PassengerView from './components/PassengerView';
import AdminView from './components/AdminView';

export const AppContext = React.createContext<{
  flights: Flight[];
  userRole: UserRole;
  addFlight: (flight: Omit<Flight, 'id'>) => void;
  updateFlight: (flight: Flight) => void;
  deleteFlight: (id: string) => void;
  login: () => void;
  logout: () => void;
} | null>(null);

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>(INITIAL_FLIGHTS);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Passenger);
  const [view, setView] = useState<View>(View.Passenger);

  const addFlight = useCallback((flight: Omit<Flight, 'id'>) => {
    setFlights(prev => [...prev, { ...flight, id: Date.now().toString() }]);
  }, []);

  const updateFlight = useCallback((updatedFlight: Flight) => {
    setFlights(prev => prev.map(f => f.id === updatedFlight.id ? updatedFlight : f));
  }, []);

  const deleteFlight = useCallback((id: string) => {
    setFlights(prev => prev.filter(f => f.id !== id));
  }, []);

  const login = useCallback(() => {
    setUserRole(UserRole.Admin);
    setView(View.Admin);
  }, []);

  const logout = useCallback(() => {
    setUserRole(UserRole.Passenger);
    setView(View.Passenger);
  }, []);

  const contextValue = useMemo(() => ({
    flights,
    userRole,
    addFlight,
    updateFlight,
    deleteFlight,
    login,
    logout,
  }), [flights, userRole, addFlight, updateFlight, deleteFlight, login, logout]);

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Header currentView={view} setView={setView} />
        <main className="p-4 sm:p-6 md:p-8">
          {view === View.Passenger ? <PassengerView /> : <AdminView />}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;
