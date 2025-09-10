
import React, { useContext } from 'react';
import FlightList from './FlightList';
import VoiceAssistant from './VoiceAssistant';
import { AppContext } from '../App';

const PassengerView: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return null;

    return (
        <div className="space-y-8">
            <VoiceAssistant flights={context.flights} />
            <FlightList flights={context.flights} />
        </div>
    );
};

export default PassengerView;
