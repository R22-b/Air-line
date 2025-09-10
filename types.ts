
export enum FlightStatus {
  OnTime = 'On Time',
  Delayed = 'Delayed',
  Boarding = 'Boarding',
  Cancelled = 'Cancelled',
  Departed = 'Departed',
}

export interface Flight {
  id: string;
  flightNumber: string;
  source: string;
  destination: string;
  departureTime: string;
  terminal: string;
  gate: string;
  status: FlightStatus;
}

export enum UserRole {
  Passenger,
  Admin,
}

export enum View {
  Passenger,
  Admin,
}
