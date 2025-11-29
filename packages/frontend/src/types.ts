export interface Departure {
	platform: string | null;
	direction: string;
	destination: string;
	scheduled_departure_utc: string;
	estimated_departure_utc: string | null;
}

export interface Recipe {
	id: string;
	name: string;
	date: string; // ISO date string YYYY-MM-DD
	description: string;
	url: string | null;
	tags: string[];
	image?: string; // Key/URL of the uploaded image
}
