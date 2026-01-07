import { useSearchParams } from '@solidjs/router';
import { keepPreviousData, useQuery } from '@tanstack/solid-query';
import { fetchRecipes, checkAuth } from '../api';
import { Calendar } from '../components/Calendar';
import { Page } from '../components/Page';
import { Loading } from '../components/Loading';
import type { RecipeParams } from '../types';
import { createSignal, onMount, Show } from 'solid-js';

export function Recipes() {
	const [verified, setVerified] = createSignal(false);

	onMount(() => {
		async function verify() {
			const isAuthed = await checkAuth();
			if (!isAuthed) {
				window.location.reload();
			} else {
				setVerified(true);
			}
		}

		void verify();
	});

	const [searchParams, setSearchParams] = useSearchParams<RecipeParams>();

	const today = new Date();
	const year = () => (searchParams.year ? parseInt(searchParams.year) : today.getFullYear());
	const month = () => (searchParams.month ? parseInt(searchParams.month) : today.getMonth() + 1);
	const currentDate = () => new Date(year(), month() - 1, month() === today.getMonth() + 1 ? today.getDate() : 1);

	const query = useQuery(() => ({
		queryKey: ['recipes', { tag: searchParams.tag, month: month(), year: year() }],
		queryFn: () => fetchRecipes({ tag: searchParams.tag, month: month(), year: year() }),
		placeholderData: keepPreviousData,
		enabled: verified(),
	}));

	const handleMonthChange = (date: Date) => {
		setSearchParams({
			year: date.getFullYear(),
			month: date.getMonth() + 1,
		});
	};

	return (
		<Show when={verified()} fallback={<Loading />}>
			<Page
				headerStart={null}
				content={
					<Calendar
						recipes={query.data}
						refetch={() => {
							void query.refetch();
						}}
						currentDate={currentDate()}
						onMonthChange={handleMonthChange}
						isLoading={query.isLoading || query.isPending}
						isFetching={query.isFetching}
						isError={query.isError}
					/>
				}
			/>
		</Show>
	);
}
