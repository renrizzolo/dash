import { createResource } from 'solid-js';
import { Page } from '../components/Page';
import { fetchRecipes } from '../api';
import { Calendar } from '../components/Calendar';

export function Recipes() {
	const [recipes, { refetch }] = createResource(fetchRecipes);

	return (
		<Page
			headerStart={<h1>Recipes</h1>}
			content={
				<>
					{recipes.loading && <p>Loading...</p>}
					{recipes.error && <p>Error loading recipes</p>}
					{recipes.state === 'ready' && <Calendar recipes={recipes()} onRecipeAdded={refetch} />}
				</>
			}
		/>
	);
}
