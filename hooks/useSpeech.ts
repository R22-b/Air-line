import { useState, useRef, useCallback, useEffect } from 'react';

// FIX: Add type definitions for Web Speech API as they are not standard in TypeScript DOM typings.
// This resolves errors related to SpeechRecognition and its associated event types.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Polyfill for cross-browser compatibility
// FIX: Rename the variable to avoid a name conflict with the SpeechRecognition interface type.
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition: SpeechRecognition | null = null;
if (SpeechRecognitionAPI) {
    recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}


export const useSpeech = (onResult: (transcript: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // FIX: Use the renamed variable for the check.
        if(SpeechRecognitionAPI) {
            setIsSupported(true);
        }
    }, []);

    const handleResult = useCallback((event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
    }, [onResult]);
    
    const handleError = useCallback((event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
    }, []);

    const startListening = useCallback(() => {
        if (recognition && !isListening) {
            recognition.start();
            setIsListening(true);
            recognition.onresult = handleResult;
            recognition.onerror = handleError;
            recognition.onend = () => setIsListening(false);
        }
    }, [isListening, handleResult, handleError]);

    const speak = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    return { isListening, startListening, speak, isSupported };
};
