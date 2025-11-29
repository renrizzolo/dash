import { createResource, createSignal, onMount, onCleanup } from 'solid-js';
import { fetchTrainData } from '../api';
import { Page } from '../components/Page';
import TrainDepartures from '../components/TrainDepartures';

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
				refetch();
				setCountdown(0);
			}
		}, 1000);

		onCleanup(() => {
			clearInterval(countdownInterval);
		});
	});

	return (
		<>
			<Page
				headerStart={
					<>
						<h1>Train Departures</h1>
						<h2>Balaclava station to City</h2>
					</>
				}
				headerEnd={<span>Last updated: {countdown()}s ago</span>}
				content={
					departures.error ? (
						<div class="error">
							Error: {departures.error?.message} <br />
							<button type="button" onClick={() => refetch()}>
								Retry
							</button>
						</div>
					) : (
						<TrainDepartures departures={departures()} dateTimeNow={dateTimeNow()} />
					)
				}
				footer={
					<p>
						<small>Source: Licensed from Public Transport Victoria under a Creative Commons Attribution 4.0 International Licence.</small>
					</p>
				}
			/>
		</>
	);
}
