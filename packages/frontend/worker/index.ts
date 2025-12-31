import { apiRoutes } from '../src/api';
import { type Recipe, type PTVDeparturesResponse } from '../src/types';

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

function getAuthFromRequest(request: Request): string | null {
	const cookieHeader = request.headers.get('Cookie');
	if (!cookieHeader) return null;

	const cookies = cookieHeader.split(';').map((c) => c.trim());
	const authCookie = cookies.find((c) => c.startsWith('CF_Authorization='));
	if (!authCookie) return null;

	const jwt = authCookie.split('=')[1];
	try {
		// index 1 is the payload
		const payload = JSON.parse(atob(jwt.split('.')[1]));

		if (payload.exp < Date.now() / 1000) {
			console.warn('JWT has expired');
			return null;
		}
		return payload.email;
	} catch (e) {
		console.error('Failed to parse JWT', e);
		return null;
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		console.log('Received request for:', url.pathname);

		if (url.pathname === apiRoutes.trainDepartures) {
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

				response = new Response(JSON.stringify(departures), {
					headers: {
						'Content-Type': 'application/json',
						'Cache-Control': `public, max-age=60, s-maxage=60`,
					},
				});

				ctx.waitUntil(cache.put(cacheKey, response.clone()));

				return response;
			} catch (error) {
				console.error('Error fetching or processing train data:', error);
				return new Response('Internal Server Error', { status: 500 });
			}
		}

		if (url.pathname === apiRoutes.auth) {
			const email = getAuthFromRequest(request);
			if (email) {
				return new Response(JSON.stringify({ email }), {
					headers: { 'Content-Type': 'application/json' },
				});
			}

			if (import.meta.env.DEV) {
				return new Response(JSON.stringify({ email: 'dev' }), { headers: { 'Content-Type': 'application/json' } });
			}

			return new Response('Unauthorized', { status: 401 });
		}

		if (url.pathname === apiRoutes.recipes) {
			if (request.method === 'GET') {
				try {
					const tag = url.searchParams.get('tag');
					const month = url.searchParams.get('month');
					const year = url.searchParams.get('year');
					if (month && !year) {
						return new Response('Year parameter is required when month is specified', { status: 400 });
					}

					let prefix = 'recipe:';
					if (month && year) {
						prefix += `${year}-${month}`;
					}

					console.log('Fetching recipes with prefix:', prefix);

					const list = await env.RECIPES_KV.list({ prefix });
					const recipes = [];

					for (const key of list.keys) {
						const value = await env.RECIPES_KV.get<Recipe>(key.name, 'json');
						if (value) {
							let matches = true;

							if (tag && (!value.tags || !value.tags.includes(tag))) {
								matches = false;
							}

							if (year && !value.date.startsWith(year)) {
								throw new Error('Date / prefix mismatch');
							}

							if (matches) {
								recipes.push(value);
							}
						}
					}

					return new Response(JSON.stringify(recipes), {
						headers: { 'Content-Type': 'application/json' },
					});
				} catch (e) {
					console.error('Error fetching recipes:', e);
					return new Response('Error fetching recipes', { status: 500 });
				}
			}

			if (request.method === 'POST') {
				try {
					const email = getAuthFromRequest(request);
					if (!email && !import.meta.env.DEV) {
						return new Response('Unauthorized', { status: 401 });
					}

					const body = await request.json<Omit<Recipe, 'id'>>();
					const id = crypto.randomUUID();

					const newRecipe = { ...body, id };

					const key = newRecipe.date ? `recipe:${newRecipe.date}:${id}` : `recipe:${id}`;

					await env.RECIPES_KV.put(key, JSON.stringify(newRecipe));

					return new Response(JSON.stringify(newRecipe), {
						headers: { 'Content-Type': 'application/json' },
						status: 201,
					});
				} catch (e) {
					console.error('Error adding recipe:', e);
					return new Response('Error adding recipe', { status: 500 });
				}
			}
		}

		if (url.pathname === apiRoutes.recipeUpload && request.method === 'PUT') {
			try {
				const key = crypto.randomUUID();
				const contentType = request.headers.get('Content-Type');

				await env.RECIPES_BUCKET.put(key, request.body, {
					httpMetadata: {
						contentType: contentType?.toString(),
					},
				});
				return new Response(JSON.stringify({ key }), {
					headers: { 'Content-Type': 'application/json' },
				});
			} catch (e) {
				console.error('Error uploading file:', e);
				return new Response('Error uploading file', { status: 500 });
			}
		}

		if (url.pathname.startsWith(apiRoutes.recipeImage)) {
			const key = url.pathname.split('/').pop();
			if (!key) {
				return new Response('Image not found', { status: 400 });
			}

			const cacheUrl = new URL(request.url);
			const cacheKey = new Request(cacheUrl.toString(), request);
			const cache = caches.default;

			let response = await cache.match(cacheKey);
			if (response) {
				return response;
			}

			try {
				const object = await env.RECIPES_BUCKET.get(key);
				if (!object) {
					return new Response('Image not found', { status: 404 });
				}

				const headers = new Headers();
				object.writeHttpMetadata(headers);

				headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

				response = new Response(object.body, {
					headers,
				});

				ctx.waitUntil(cache.put(cacheKey, response.clone()));

				return response;
			} catch (e) {
				console.error('Error fetching image:', e);
				return new Response('Error fetching image', { status: 500 });
			}
		}

		// Default response for other paths
		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
