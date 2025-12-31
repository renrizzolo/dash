import type { Departure, Recipe } from './types';

export const apiRoutes = {
	trainDepartures: '/api/trains',
	recipes: '/api/recipes',
	recipeUpload: '/api/recipes/upload',
	recipeImage: '/api/recipes/images',
	auth: '/api/auth/user',
} as const;

type APIEndpoint = (typeof apiRoutes)[keyof typeof apiRoutes];

type ApiReturnType<T extends APIEndpoint> = T extends '/api/trains'
	? Departure[]
	: T extends '/api/recipes'
	? Recipe[]
	: T extends '/api/recipes/upload'
	? { key: string }
	: T extends `/api/recipes/images`
	? { key: string }
	: T extends '/api/auth/user'
	? { email: string }
	: never;

async function apiFetch<T extends APIEndpoint>(
	endpoint: T,
	searchParams?: Record<string, string | number | undefined>,
	options?: RequestInit
): Promise<ApiReturnType<T>> {
	let params: URLSearchParams | null = null;

	if (searchParams) {
		params = new URLSearchParams();
		Object.entries(searchParams).forEach(([key, value]) => {
			if (value !== undefined) {
				params!.append(key, value.toString());
			}
		});
	}

	const response = await fetch(endpoint + (params ? `?${params.toString()}` : ''), options);
	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}

	try {
		const data = await response.json();
		return data as ApiReturnType<T>;
	} catch {
		throw new Error('Failed to parse data.');
	}
}

export async function fetchTrainData() {
	return apiFetch('/api/trains');
}

export async function fetchRecipes(searchParams?: { tag: string | undefined; month: number | undefined; year: number | undefined }) {
	return apiFetch('/api/recipes', searchParams, {
		headers: {
			'Cache-Control': 'no-cache',
		},
	});
}

export async function addRecipe(recipe: Omit<Recipe, 'id'>) {
	return apiFetch(
		'/api/recipes',
		{},
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(recipe),
		}
	);
}

export async function uploadImage(file: File | Blob) {
	const response = await apiFetch(
		'/api/recipes/upload',
		{},
		{
			method: 'PUT',
			body: file,
		}
	);

	return response.key;
}

export async function checkAuth() {
	try {
		await apiFetch('/api/auth/user');
		return true;
	} catch {
		return false;
	}
}

export async function fetchAuthUser() {
	return apiFetch('/api/auth/user');
}
