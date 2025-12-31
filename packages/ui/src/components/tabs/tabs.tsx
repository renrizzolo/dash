import { createEffect, createSignal, type JSXElement, onCleanup } from 'solid-js';
import { TabsContext } from './tabsContext';

export function Tabs(props: { children: JSXElement }) {
	const [activeTab, setActiveTab] = createSignal('');
	const [tabs, setTabs] = createSignal<string[]>([]);

	function onKeydown(e: KeyboardEvent) {
		const tabs = document.querySelectorAll('.tabs [role="tab"]');
		const activeElement = document.activeElement;

		if (!activeElement || !Array.from(tabs).includes(activeElement)) {
			return;
		}

		let currentIndex = Array.from(tabs).indexOf(activeElement);

		if (e.key === 'ArrowRight') {
			currentIndex = (currentIndex + 1) % tabs.length;
			(tabs[currentIndex] as HTMLElement | undefined)?.focus();
			e.preventDefault();
		} else if (e.key === 'ArrowLeft') {
			currentIndex = (currentIndex - 1 + tabs.length) % tabs.length;
			(tabs[currentIndex] as HTMLElement | undefined)?.focus();
			e.preventDefault();
		}
	}

	createEffect(() => {
		document.addEventListener('keydown', onKeydown);
	});

	onCleanup(() => {
		document.removeEventListener('keydown', onKeydown);
	});

	return (
		<TabsContext.Provider value={{ activeTab: activeTab(), setActiveTab, tabs: tabs(), setTabs }}>
			<div class="tabs flex-row gap-2" role="tablist">
				{props.children}
			</div>
		</TabsContext.Provider>
	);
}
