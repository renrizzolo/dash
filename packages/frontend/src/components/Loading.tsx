import { Show } from 'solid-js';

export function Loading() {
	return (
		<div class="loading-container">
			<div class="spinner">
				<svg viewBox="0 0 50 50">
					<circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
				</svg>
			</div>
		</div>
	);
}

export function LoadingBlip(props: { active: boolean }) {
	return (
		<Show when={props.active}>
			<div class="loading-container">
				<div class="blip"></div>
			</div>
		</Show>
	);
}
