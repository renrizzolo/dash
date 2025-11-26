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
	vehicle_descriptor: any;
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

interface PTVDisruption {}

interface PTVDeparturesResponse {
	departures: PTVDeparture[];
	directions: Record<string, PTVDirection>;
	runs: Record<string, PTVRun>;
	routes: Record<string, PTVRoute>;
	stops: Record<string, PTVStop>;
	disruptions: PTVDisruption[];
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

// Helper function to build PTV API URL with signature
async function buildPtvUrl(path: string, developerId: string, apiKey: string): Promise<string> {
	if (!developerId || !apiKey) {
		throw new Error('PTV Developer ID or API Key is not set');
	}

	console.log('Building PTV URL for path:', developerId, apiKey);

	const baseUrl = 'https://timetableapi.ptv.vic.gov.au';

	// Create a SHA1 HMAC.
	const hmacKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(apiKey), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);

	// The request message for signature calculation is the URL path and query parameters,
	// including devid, but excluding the base URL.
	const requestMessage = `${path}${path.includes('?') ? '&' : '?'}devid=${developerId}`;

	const signatureBuffer = await crypto.subtle.sign('HMAC', hmacKey, new TextEncoder().encode(requestMessage));

	const signature = Array.from(new Uint8Array(signatureBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase();

	return `${baseUrl}${requestMessage}&signature=${signature}`;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/api/trains') {
			try {
				// check the cache first
				const cacheUrl = new URL(request.url);
				const cacheKey = new Request(cacheUrl.toString(), request);
				const cache = caches.default;

				let response = await cache.match(cacheKey);
				if (response) {
					console.log('Serving from cache');
					return response;
				}

				// Balaclava Station stop ID: 1013
				// Direction ID for Citybound: 1
				// Route type 0 for trains
				const ptvApiPath = `/v3/departures/route_type/0/stop/1013?look_backwards=false&direction_id=1&expand=3&max_results=10`;

				const ptvUrl = await buildPtvUrl(ptvApiPath, env.PTV_DEVELOPER_ID, env.PTV_API_KEY);

				const ptvResponse = await fetch(ptvUrl);
				if (!ptvResponse.ok) {
					console.error(`PTV API error: ${ptvResponse.status} ${ptvResponse.statusText}`);
					return new Response('Failed to fetch train data from PTV API', {
						status: 500,
					});
				}

				const data: PTVDeparturesResponse = await ptvResponse.json();

				console.log('Fetched PTV data');
				// Extract relevant information
				const departures = data.departures.map((departure) => {
					const direction = data.directions[departure.direction_id];
					const run = data.runs[departure.run_id];
					const route = data.routes[departure.route_id];
					const stop = data.stops[departure.stop_id];

					return {
						platform: departure.platform_number,
						direction: direction ? direction.direction_name : 'N/A',
						destination: run ? run.destination_name : 'N/A',
						scheduled_departure_utc: departure.scheduled_departure_utc,
						estimated_departure_utc: departure.estimated_departure_utc,
						route_name: route ? route.route_name : 'N/A',
						stop_name: stop ? stop.stop_name : 'N/A',
					};
				});

				// calculate cache TTL based on the next train
				let cacheTtl = 60;
				if (departures.length > 0) {
					const nextTrain = departures[0];
					const departureTime = new Date(nextTrain.estimated_departure_utc || nextTrain.scheduled_departure_utc).getTime();
					const now = Date.now();
					const secondsUntilDeparture = Math.floor((departureTime - now) / 1000);

					// cache until 30 seconds after the next train departs, clamped between 30 seconds and 5 minutes
					cacheTtl = Math.max(30, Math.min(300, secondsUntilDeparture + 30));
				}

				response = new Response(JSON.stringify(departures), {
					headers: {
						'Content-Type': 'application/json',
						'Cache-Control': `public, max-age=${cacheTtl}, s-maxage=${cacheTtl}`,
					},
				});

				ctx.waitUntil(cache.put(cacheKey, response.clone()));

				return response;
			} catch (error) {
				console.error('Error fetching or processing train data:', error);
				return new Response('Internal Server Error', { status: 500 });
			}
		}

		// Default response for other paths
		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
