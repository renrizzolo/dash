import { clsx, type ClassValue } from 'clsx';
import { Show } from 'solid-js';

export interface LoadingProps {
	class?: ClassValue;
}

export function Loading(props: LoadingProps) {
	return (
		<div class={clsx('flex items-center justify-center', props.class)}>
			<div class="w-5 h-5 rounded-full border-t-2 border-b-2 border-400 animate-spin" />
		</div>
	);
}

export interface LoadingBlipProps {
	active: boolean;
	class?: ClassValue;
}

export function LoadingBlip(props: LoadingBlipProps) {
	return (
		<Show when={props.active}>
			<div class={clsx('flex items-center justify-center', props.class)}>
				<div class="w-3 h-3 bg-400 rounded-full animate-blip" />
			</div>
		</Show>
	);
}
