/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import App from './App.tsx';
import { Recipes } from './pages/Recipes';
import { Train } from './pages/Train';

const root = document.getElementById('root');

const queryClient = new QueryClient();

render(
	() => (
		<QueryClientProvider client={queryClient}>
			<Router root={App}>
				<Route path="/" component={() => 'Dash'} />
				<Route path="/recipes" component={Recipes} />
				<Route path="/train" component={Train} />
			</Router>
		</QueryClientProvider>
	),
	root!
);
