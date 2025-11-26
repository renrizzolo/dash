import { createResource, createSignal, onCleanup, onMount } from 'solid-js';
import { fetchTrainData } from './api';
import TrainDepartures from './components/TrainDepartures';
import './App.css';

const REFRESH_INTERVAL_SECONDS = 60;

function App() {
	const [departures, { refetch }] = createResource(fetchTrainData);
	const [countdown, setCountdown] = createSignal(REFRESH_INTERVAL_SECONDS);
	const [dateTimeNow, setDateTimeNow] = createSignal(new Date());
	onMount(() => {
		const countdownInterval = setInterval(() => {
			setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
			setDateTimeNow(new Date());

			if (countdown() === 0) {
				refetch();
				setCountdown(REFRESH_INTERVAL_SECONDS);
			}
		}, 1000);

		onCleanup(() => {
			clearInterval(countdownInterval);
		});
	});

	return (
		<main class="main">
			<header class="header">
				<div class="header-start">
					<h1>Train Departures</h1>
					<h2>Balaclava station to City</h2>
				</div>
				<div class="header-end">
					<span class="countdown">Next refresh in: {countdown()}s</span>
				</div>
			</header>
			<section>
				{departures.error ? (
					<div class="error">Error: {departures.error?.message}</div>
				) : (
					<TrainDepartures departures={departures()} dateTimeNow={dateTimeNow()} />
				)}
			</section>
		</main>
	);
}

export default App;
