import { useQuery } from '@tanstack/solid-query';
import { fetchRecipes } from '../api';
import { Calendar } from '../components/Calendar';
import { Page } from '../components/Page';

export function Recipes() {
	const urlParams = new URLSearchParams(window.location.search);
	const tag = urlParams.get('tag') || undefined;
	const month = urlParams.get('month') || undefined;
	const year = urlParams.get('year') || undefined;

	const query = useQuery(() => ({
		queryKey: ['recipes', { tag, month, year }],
		queryFn: () => fetchRecipes({ tag, month, year }),
	}));

	return (
		<Page
			headerStart={<h1>Recipes</h1>}
			content={
				<>
					{query.isLoading && <p>Loading...</p>}
					{query.isError && <p>Error loading recipes</p>}
					{query.isSuccess && (
						<Calendar
							recipes={query.data}
							onRecipeAdded={() => {
								void query.refetch();
							}}
						/>
					)}
				</>
			}
		/>
	);
}
