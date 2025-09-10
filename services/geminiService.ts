
import { GoogleGenAI, Type } from '@google/genai';
import { Flight } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface VoiceCommandResponse {
  intent: 'find_flight' | 'find_terminal' | 'find_gate' | 'find_status' | 'unknown';
  flightNumber?: string;
  error?: string;
}

export const processVoiceCommand = async (transcript: string, flights: Flight[]): Promise<VoiceCommandResponse> => {
  if (!process.env.API_KEY) {
    console.error("API key not found.");
    return { intent: 'unknown', error: "API key is not configured." };
  }
  
  const flightNumbers = flights.map(f => f.flightNumber).join(', ');

  const prompt = `
    You are an airline information assistant. Your task is to analyze the user's query and determine their intent and the relevant flight number.
    The available flight numbers are: ${flightNumbers}.

    User query: "${transcript}"

    Based on the query, identify one of the following intents:
    - 'find_flight': User wants general details about a flight.
    - 'find_terminal': User is asking for the terminal number.
    - 'find_gate': User is asking for the gate number.
    - 'find_status': User is asking for the flight status.
    - 'unknown': The intent cannot be determined or the flight number is not in the provided list.

    Extract the flight number from the query. The flight number must be one of the available flight numbers.
    Return the result in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              enum: ['find_flight', 'find_terminal', 'find_gate', 'find_status', 'unknown'],
            },
            flightNumber: {
              type: Type.STRING,
              description: 'The flight number mentioned by the user.',
            },
            error: {
              type: Type.STRING,
              description: 'Any error message if the intent is unknown.',
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText) as VoiceCommandResponse;

    if (parsedResponse.flightNumber && !flightNumbers.includes(parsedResponse.flightNumber.toUpperCase())) {
      return { intent: 'unknown', error: `I couldn't find a flight with number ${parsedResponse.flightNumber}.` };
    }
    
    return parsedResponse;
  } catch (error) {
    console.error('Error processing voice command with Gemini:', error);
    return {
      intent: 'unknown',
      error: "Sorry, I had trouble understanding that. Please try again.",
    };
  }
};
