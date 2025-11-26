export interface Departure {
  platform: string | null;
  direction: string;
  destination: string;
  scheduled_departure_utc: string;
  estimated_departure_utc: string | null;
}
