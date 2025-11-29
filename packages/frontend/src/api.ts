import type { Departure, Recipe } from './types';

type APIEndpoint = `/api/trains` | `/api/recipes` | `/api/recipes/upload`;

async function apiFetch<T>(endpoint: APIEndpoint, options?: RequestInit): Promise<T> {
	const response = await fetch(endpoint, options);
	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}
	try {
		const data = await response.json();
		return data;
	} catch (e) {
		throw new Error('Failed to parse train data.');
	}
}

export async function fetchTrainData(): Promise<Departure[]> {
	return apiFetch<Departure[]>('/api/trains');
}

export async function fetchRecipes(): Promise<Recipe[]> {
	return apiFetch<Recipe[]>('/api/recipes');
}

export async function addRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
	return apiFetch<Recipe>('/api/recipes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(recipe),
	});
}

export async function uploadImage(file: File | Blob): Promise<string> {
	const response = await apiFetch<{ key: string }>('/api/recipes/upload', {
		method: 'PUT',
		body: file,
	});

	return response.key;
}
