import './App.css';
import { type RouteSectionProps } from '@solidjs/router';
import { TabLink } from 'ui/components';

function App(props: RouteSectionProps) {
	return (
		<div class="font-sans app-container bg-background stack-center-4">
			<nav class="flex-row gap-4 mb-8">
				<TabLink href="/recipes">Recipes</TabLink>
				<TabLink href="/train">Train</TabLink>
			</nav>
			<main class="main">{props.children}</main>
		</div>
	);
}

export default App;
