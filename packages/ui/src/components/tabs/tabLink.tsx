import { A } from '@solidjs/router';
import { onCleanup, onMount, type JSXElement } from 'solid-js';
import { useTabsContext } from './tabsContext';
import clsx from 'clsx';
import { buttonVariantStyles } from '../button';

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
			data-active={context.activeTab === props.href ? 'true' : 'false'}
			class={clsx(
				'rounded-lg no-underline flex-col items-center line-height-1',
				buttonVariantStyles({ variant: 'ghost', size: 'default', rounded: 'default' }),
			)}
			role="tab"
			aria-selected={context.activeTab === props.href}
			href={props.href}
			onClick={() => context.setActiveTab(props.href)}
		>
			{props.children}
		</A>
	);
}
