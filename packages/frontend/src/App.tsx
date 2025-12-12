import './App.css';
import { A, type RouteSectionProps } from '@solidjs/router';

function App(props: RouteSectionProps) {
	return (
		<div class="app-container bg-background stack-center-4">
			<nav>
				<A href="/recipes">Recipes</A> <A href="/train">Train</A>
			</nav>
			<main class="main">{props.children}</main>
		</div>
	);
}

export default App;
