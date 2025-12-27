import { A } from '@solidjs/router';
import type { JSXElement } from 'solid-js';

export function TabLink(props: { href: string; children: JSXElement }) {
	return (
		<A class="py-2 px-3 rounded-lg no-underline text-muted hocus:(text-default bg-100) active:(text-default bg-100)" href={props.href}>
			{props.children}
		</A>
	);
}
