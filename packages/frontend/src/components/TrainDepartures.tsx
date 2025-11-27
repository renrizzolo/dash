import type { Component } from 'solid-js';
import { For, Match, Switch } from 'solid-js';
import type { Departure } from '../types';

interface TrainDeparturesProps {
	departures: Departure[] | undefined;
	dateTimeNow: Date;
}

const TrainDepartures: Component<TrainDeparturesProps> = (props) => {
	const relativeTime = (departureDate: string, showSeconds: boolean) => {
		const date = new Date(departureDate);
		const now = props.dateTimeNow;
		const diffMs = date.getTime() - now.getTime();
		const totalSecs = Math.floor(diffMs / 1000);

		if (totalSecs <= 0) {
			return 'departed';
		}

		const diffMins = Math.floor(totalSecs / 60);

		if (!showSeconds) {
			return `+${diffMins}m`;
		}

		const diffSecs = totalSecs % 60;

		if (diffMins <= 0) {
			return 'departing';
		} else {
			return `+${diffMins}m ${diffSecs}s`;
		}
	};

	return (
		<div class="train-departures-grid">
			<Switch fallback={<p>Loading departures...</p>}>
				<Match when={props.departures === undefined}>
					<p>Loading departures...</p>
				</Match>
				<Match when={props.departures && props.departures.length === 0}>
					<p>No upcoming departures found.</p>
				</Match>
				<Match when={props.departures && props.departures.length > 0}>
					<For each={props.departures} fallback={null}>
						{(departure, index) => {
							const relative = () => relativeTime(departure.estimated_departure_utc || departure.scheduled_departure_utc, index() === 0);
							const isDelayedOrEarly =
								departure.estimated_departure_utc && departure.scheduled_departure_utc !== departure.estimated_departure_utc;

							return (
								<div
									class={'departure-item' + (index() === 0 ? ' departure-item-next' : '') + (relative() === 'departed' ? ' departed' : '')}
								>
									<div class="departure-info">
										<span>
											<span class="departure-item-label">Platform</span> {departure.platform || '-'}
										</span>
									</div>
									<div class="departure-info">
										<span class="departure-time">
											<time class={isDelayedOrEarly ? 'delayed' : ''}>
												{formatUTCDateToLocal(departure.scheduled_departure_utc)} {isDelayedOrEarly && <br />}
											</time>
											{isDelayedOrEarly && <time>{formatUTCDateToLocal(departure.estimated_departure_utc!)} </time>}
											<span class="relative-time">
												<Switch fallback={relative()}>
													<Match when={relative() === 'departed'}>
														<span class="departed">Departed</span>
													</Match>
													<Match when={relative() === 'departing'}>
														<span class="departing">Departing</span>
													</Match>
												</Switch>
											</span>
										</span>
										<div class="badge">{departure.destination}</div>
									</div>
								</div>
							);
						}}
					</For>
				</Match>
			</Switch>
		</div>
	);
};

export default TrainDepartures;

/**
 * Format a UTC date string to Australian Eastern Time
 *
 * Note: not using date.toLocaleString because the kindle browser
 * I'm using this on is set to GMT+00 and doesn't support timezones properly.
 */
function formatUTCDateToLocal(dateString: string): string {
	const date = new Date(dateString);

	const utcHours = date.getUTCHours();
	const utcMinutes = date.getUTCMinutes();

	const offset = getManualOffset(dateString);
	const localHours = utcHours + offset;

	const localDate = new Date();
	localDate.setHours(localHours, utcMinutes, 0, 0);

	return localDate.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
}

/** Get the timezone offset for a UTC date to Australian Eastern Time */
function getManualOffset(dateString: string): number {
	const date = new Date(dateString);
	const month = date.getMonth();

	if (month >= 9 || month <= 2) {
		// AEDT
		return 11;
	} else {
		// AEST
		return 10;
	}
}
