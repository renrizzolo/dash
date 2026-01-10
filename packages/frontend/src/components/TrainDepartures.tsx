import type { Component } from 'solid-js';
import { Card, Badge, Loading } from 'ui/components';
import { clsx } from 'clsx';
import { For, Match, Switch, Show } from 'solid-js';
import type { Departure } from '../types';

interface TrainDeparturesProps {
	departures: Departure[] | undefined;
	dateTimeNow: Date;
	loading?: boolean;
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
		<div class={'stack-stretch-4 ' + (props.loading ? 'opacity-50' : '')}>
			<Switch fallback={<Loading />}>
				<Match when={props.departures === undefined}>
					{Array.from({ length: 10 }).map(() => (
						<Card mode="dark" variant="default">
							<div class="flex-row justify-between items-end">
								<span class="text-xs font-medium">&nbsp;</span>
								<span>&nbsp;</span>
							</div>
							<div class="flex-row justify-between items-end">
								<span class="text-xl font-bold">
									<time>&nbsp;</time>
								</span>
							</div>
						</Card>
					))}
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
							const hasDisruptions = () => departure.disruptions && departure.disruptions.length > 0;

							return (
								<Card variant={index() === 0 ? 'highlight' : 'default'} mode="dark" class={relative() === 'departed' ? 'opacity-50' : ''}>
									<div class="flex-row justify-between items-end w-full">
										<span class={clsx('text-xs font-medium', isDelayedOrEarly && 'text-strike')}>
											{isDelayedOrEarly ? <time>{formatUTCDateToLocal(departure.scheduled_departure_utc)}</time> : 'On time'}
										</span>
										<span class="text-xs">
											<span class="text-inverse-muted font-light">Platform</span> {departure.platform || '-'}
										</span>
									</div>
									<div class="flex-row justify-between items-end w-full">
										<span class="text-xl font-bold">
											<time>
												{formatUTCDateToLocal(isDelayedOrEarly ? departure.estimated_departure_utc! : departure.scheduled_departure_utc)}{' '}
											</time>
											<span class="text-lg text-inverse-muted">
												<Switch fallback={relative()}>
													<Match when={relative() === 'departed'}>
														<span>Departed</span>
													</Match>
													<Match when={relative() === 'departing'}>
														<span>Departing</span>
													</Match>
												</Switch>
											</span>
										</span>
										<Badge>{departure.destination}</Badge>
									</div>
									<Show when={hasDisruptions()}>
										<div class="stack-stretch-2 mt-2">
											<For each={departure.disruptions}>
												{(disruption) => (
													<div class="text-xs leading-5 ps-2" style={{ 'border-left': `3px solid ${disruption.colour}` }}>
														<a href={disruption.url} class="no-underline hover:underline text-inverse" target="_blank" rel="noreferrer">
															{disruption.title}
														</a>
													</div>
												)}
											</For>
										</div>
									</Show>
								</Card>
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
