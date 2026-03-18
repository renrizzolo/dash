import { createResource, createSignal, onMount, onCleanup } from 'solid-js';
import { fetchTrainData } from '../api';
import { Page } from '../components/Page';
import TrainDepartures from '../components/TrainDepartures';
import { Heading, Button } from 'ui/components';

const REFRESH_INTERVAL_SECONDS = 60;

export function Train() {
	const [departures, { refetch }] = createResource(fetchTrainData);
	const [countdown, setCountdown] = createSignal(0);
	const [dateTimeNow, setDateTimeNow] = createSignal(new Date());

	onMount(() => {
		const countdownInterval = setInterval(() => {
			setCountdown((prev) => (prev < REFRESH_INTERVAL_SECONDS ? prev + 1 : 0));
			setDateTimeNow(new Date());

			if (countdown() === REFRESH_INTERVAL_SECONDS) {
				void refetch();
				setCountdown(0);
			}
		}, 1000);

		onCleanup(() => {
			clearInterval(countdownInterval);
		});
	});

	return (
		<Page
			headerStart={
				<>
					<Heading level={1}>Train Departures</Heading>
					<Heading level={2}>Balaclava station to City</Heading>
				</>
			}
			headerEnd={<span class="text-xs text-muted font-mono">Last updated: {countdown()}s ago</span>}
			content={
				departures.error ? (
					<div class="text-accent text-center stack-center-2">
						Error: {departures.error?.message} <br />
						<Button
							onClick={() => {
								void refetch();
							}}
						>
							Retry
						</Button>
					</div>
				) : (
					<TrainDepartures departures={departures()} dateTimeNow={dateTimeNow()} loading={departures.loading} />
				)
			}
			footer={
				<p class="mt-4 text-sm text-center text-muted">
					Source: Licensed from Public Transport Victoria under a Creative Commons Attribution 4.0 International Licence.
				</p>
			}
		/>
	);
}
