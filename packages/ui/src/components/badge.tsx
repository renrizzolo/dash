import { clsx, type ClassValue } from 'clsx';
import type { JSX } from 'solid-js';

export interface BadgeProps {
	children: JSX.Element;
	class?: ClassValue;
}

export function Badge(props: BadgeProps) {
	return <div class={clsx('bg-default text-default px-1 py-0.5 rounded text-xs font-medium uppercase', props.class)}>{props.children}</div>;
}
