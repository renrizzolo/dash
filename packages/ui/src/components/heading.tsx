import clsx from 'clsx';
import { Match, Switch } from 'solid-js';

const baseClass = 'font-sans';

export function Heading(props: { level: 1 | 2 | 3 | 4; children: string }) {
	return (
		<Switch>
			<Match when={props.level === 1}>
				<h1 class={clsx(baseClass, 'text-2xl font-bold')}>{props.children}</h1>
			</Match>
			<Match when={props.level === 2}>
				<h2 class={clsx(baseClass, 'text-lg font-semibold')}>{props.children}</h2>
			</Match>
			<Match when={props.level === 3}>
				<h3 class={clsx(baseClass, 'text-md font-medium')}>{props.children}</h3>
			</Match>
			<Match when={props.level === 4}>
				<h4 class={clsx(baseClass, 'text-sm font-bold')}>{props.children}</h4>
			</Match>
		</Switch>
	);
}
