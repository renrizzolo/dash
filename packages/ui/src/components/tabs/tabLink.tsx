import { A } from '@solidjs/router';
import { onCleanup, onMount, type JSXElement } from 'solid-js';
import { useTabsContext } from './tabsContext';

export function TabLink(props: { href: string; children: JSXElement }) {
	const context = useTabsContext();

	onMount(() => {
		// if this is the first tab, set it as active
		if (context.tabs.length === 0) {
			context.setActiveTab(props.href);
		}
		// register this tab
		context.setTabs(Array.from(new Set([...context.tabs, props.href])));
	});

	onCleanup(() => {
		// unregister this tab
		context.setTabs(context.tabs.filter((tab) => tab !== props.href));
		// if this was the active tab, clear active tab
		if (context.activeTab === props.href) {
			context.setActiveTab('');
		}
	});

	return (
		<A
			class="py-2 px-3 rounded-lg no-underline text-muted hocus:(text-default bg-100) active:(text-default bg-100)"
			role="tab"
			aria-selected={context.activeTab === props.href}
			href={props.href}
			onClick={() => context.setActiveTab(props.href)}
		>
			{props.children}
		</A>
	);
}
