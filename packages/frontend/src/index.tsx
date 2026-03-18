/* @refresh reload */
import 'virtual:uno.css';
import '@unocss/reset/eric-meyer.css';
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import App from './App.tsx';
import { Recipes } from './pages/Recipes';
import { Train } from './pages/Train';
import { Card, Heading } from 'ui/components';

const root = document.getElementById('root');

const queryClient = new QueryClient();

render(
	() => (
		<QueryClientProvider client={queryClient}>
			<Router root={App}>
				<Route
					path="/"
					component={() => (
						<Card class="stack-start-2">
							<Heading level={1}>Dash</Heading>
							<p class="text-muted">This is my personal dashboard.</p>
						</Card>
					)}
				/>
				<Route path="/recipes" component={Recipes} />
				<Route path="/train" component={Train} />
			</Router>
		</QueryClientProvider>
	),
	root!
);
