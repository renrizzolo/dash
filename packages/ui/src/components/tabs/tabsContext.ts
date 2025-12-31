import { useContext, createContext } from 'solid-js';

export const TabsContext = createContext<{
	activeTab: string;
	setActiveTab: (tab: string) => void;
	tabs: string[];
	setTabs: (tabs: string[]) => void;
}>();

export function useTabsContext() {
	const context = useContext(TabsContext);

	if (!context) {
		throw new Error('useTabsContext must be used within a TabsProvider');
	}

	return context;
}
