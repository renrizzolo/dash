export interface Recipe {
	id: string;
	name: string;
	date: string; // ISO date string YYYY-MM-DD
	description: string;
	url: string | null;
	tags: string[];
	image?: string; // Key/URL of the uploaded image
}

export type RecipeParams = {
	year: string | undefined;
	month: string | undefined;
	tag: string | undefined;
};

export interface Departure {
	platform: string | null;
	direction: string;
	destination: string;
	scheduled_departure_utc: string;
	estimated_departure_utc: string | null;
	disruptions: Disruption[];
}

export interface Disruption {
	disruption_id: number;
	title: string;
	description: string;
	url: string;
	colour: string;
	display_status: string;
}

interface PTVDeparture {
	stop_id: number;
	route_id: number;
	run_id: number;
	direction_id: number;
	scheduled_departure_utc: string;
	estimated_departure_utc: string | null;
	at_platform: boolean;
	platform_number: string;
	flags: string;
	route_type: number;
	line_id: number;
}

interface PTVDirection {
	direction_id: number;
	direction_name: string;
	route_type: number;
}

interface PTVRun {
	run_id: number;
	route_id: number;
	direction_id: number;
	destination_name: string;
	express_stop_count: number;
	vehicle_descriptor: unknown;
}

interface PTVRoute {
	route_id: number;
	route_name: string;
	route_number: string;
	route_type: number;
}

interface PTVStop {
	stop_id: number;
	stop_name: string;
	stop_latitude: number;
	stop_longitude: number;
	route_type: number;
	station_type: string;
	stop_suburb: string;
}

interface PTVDisruptionRoute {
	route_type: number;
	route_id: number;
	direction: {
		direction_id: number;
		direction_name: string;
		route_type: number;
	} | null;
}

interface PTVDisruptionStop {
	stop_id: number;
	stop_name: string;
}

interface PTVDisruption {
	disruption_id: number;
	title: string;
	url: string;
	description: string;
	disruption_status: string;
	disruption_type: string;
	published_datetime: string;
	last_updated_datetime: string;
	from_date: string;
	to_date: string;
	routes: PTVDisruptionRoute[];
	stops: PTVDisruptionStop[];
	colour: string;
	display_status: string;
}

export interface PTVDeparturesResponse {
	departures: PTVDeparture[];
	directions: Record<string, PTVDirection>;
	runs: Record<string, PTVRun>;
	routes: Record<string, PTVRoute>;
	stops: Record<string, PTVStop>;
	disruptions: Record<string, PTVDisruption>;
	status: {
		version: string;
		health: {
			database: boolean;
			memcache: boolean;
			geocoder: boolean;
			gtfs: boolean;
			rt: boolean;
			security_token: boolean;
		};
	};
}
