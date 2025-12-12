import type { Component } from 'solid-js';

const App: Component = () => {
	return (
		<div class="font-sans p-4">
			<div class="stack-start-4">
				<h1 class="text-xl">Stack</h1>
				<div class="bg-muted rounded-3 p-4">Item 1</div>
				<div class="bg-muted rounded-1 p-3">Item 2</div>
				<button class="hocus:bg-inverse focus:ring-default rounded-2 border-default hocus:text-inverse p-2">Item 3</button>
			</div>
		</div>
	);
};

export default App;
