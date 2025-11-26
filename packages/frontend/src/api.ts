import type { Departure } from './types';

// Set this to true to use dummy data for frontend development

const dummyData: Departure[] = [
	{
		platform: '1',
		direction: 'Flinders Street',
		destination: 'Flinders Street',
		scheduled_departure_utc: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
		estimated_departure_utc: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
	},
	{
		platform: '2',
		direction: 'Sandringham',
		destination: 'Sandringham',
		scheduled_departure_utc: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
		estimated_departure_utc: new Date(Date.now() + 14 * 60 * 1000).toISOString(),
	},
	{
		platform: '1',
		direction: 'Flinders Street',
		destination: 'Flinders Street',
		scheduled_departure_utc: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
		estimated_departure_utc: null,
	},
];

export async function fetchTrainData(): Promise<Departure[]> {
	if (window.location.search.includes('d=true')) {
		console.log('Using dummy data for train departures.');
		return new Promise<Departure[]>((resolve) => {
			setTimeout(() => {
				resolve(dummyData);
			}, 1000);
		});
	}

	const response = await fetch('/api/trains');

	if (!response.ok) {
		throw new Error(`Could not fetch train data. Status: ${response.status}`);
	}
	try {
		const data = await response.json();
		return data;
	} catch (e) {
		throw new Error('Failed to parse train data.');
	}
}
