
import React, { useState, useCallback } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { processVoiceCommand, VoiceCommandResponse } from '../services/geminiService';
import { Flight } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface VoiceAssistantProps {
  flights: Flight[];
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ flights }) => {
  const [feedback, setFeedback] = useState<string>('Tap the mic and ask about a flight.');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleVoiceResult = useCallback(async (transcript: string) => {
    setIsLoading(true);
    setFeedback(`Processing: "${transcript}"`);
    
    const result = await processVoiceCommand(transcript, flights);
    let responseText = '';

    if (result.intent === 'unknown' || !result.flightNumber) {
        responseText = result.error || "I'm sorry, I couldn't find that flight information.";
    } else {
        const flight = flights.find(f => f.flightNumber.toUpperCase() === result.flightNumber?.toUpperCase());
        if (!flight) {
            responseText = `I couldn't find flight ${result.flightNumber}.`;
        } else {
            switch(result.intent) {
                case 'find_flight':
                    responseText = `Flight ${flight.flightNumber} from ${flight.source} to ${flight.destination} is scheduled for ${flight.departureTime} from terminal ${flight.terminal}, gate ${flight.gate}. The status is ${flight.status}.`;
                    break;
                case 'find_terminal':
                    responseText = `Flight ${flight.flightNumber} is at terminal ${flight.terminal}.`;
                    break;
                case 'find_gate':
                    responseText = `Flight ${flight.flightNumber} is at gate ${flight.gate}.`;
                    break;
                case 'find_status':
                    responseText = `The status of flight ${flight.flightNumber} is ${flight.status}.`;
                    break;
                default:
                    responseText = "Sorry, I'm not sure how to help with that.";
            }
        }
    }

    setFeedback(responseText);
    speak(responseText);
    setIsLoading(false);
  }, [flights]);

  const { isListening, startListening, speak, isSupported } = useSpeech(handleVoiceResult);
  
  const handleMicClick = () => {
    if (isListening) return;
    setFeedback('Listening...');
    startListening();
  }
  
  if (!isSupported) {
    return (
        <div className="text-center p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
            Voice assistance is not supported in your browser.
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-gray-800/60 rounded-xl border border-gray-700">
        <button
            onClick={handleMicClick}
            disabled={isListening || isLoading}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-200
                ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'}
                disabled:bg-gray-500 disabled:cursor-not-allowed`}
        >
            <MicrophoneIcon className="w-10 h-10 text-white" />
        </button>
        <p className="text-center text-gray-300 min-h-[40px]">
            {isLoading ? 'Thinking...' : feedback}
        </p>
    </div>
  );
};

export default VoiceAssistant;
