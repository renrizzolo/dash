import './App.css';
import { type RouteSectionProps } from '@solidjs/router';
import { TabLink } from 'ui/components';

function App(props: RouteSectionProps) {
	return (
		<div class="font-sans w-container bg-background stack-center-4 my-0 mx-auto sm:p-8 p-4">
			<nav class="flex-row gap-4 mb-8">
				<TabLink href="/recipes">Recipes</TabLink>
				<TabLink href="/train">Train</TabLink>
			</nav>
			<main class="w-full stack-justify-4 text-center">{props.children}</main>
		</div>
	);
}

export default App;
