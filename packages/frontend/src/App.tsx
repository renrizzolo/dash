import '@unocss/reset/eric-meyer.css';

import { type RouteSectionProps } from '@solidjs/router';
import { TabLink, Tabs, ToastProvider } from 'ui/components';

function App(props: RouteSectionProps) {
	return (
		<ToastProvider>
			<div class="w-full stack-stretch-4 text-center font-sans max-w-container bg-default stack-center-4 my-0 mx-auto sm:p-8 p-4">
				<nav class="w-max self-center">
					<Tabs>
						<TabLink href="/recipes">Recipes</TabLink>
						<TabLink href="/train">Train</TabLink>
					</Tabs>
				</nav>
				<main>{props.children}</main>
			</div>
		</ToastProvider>
	);
}

export default App;
