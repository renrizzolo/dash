import { clsx, type ClassValue } from 'clsx';
import type { JSX } from 'solid-js';

export interface BadgeProps {
	children: JSX.Element;
	class?: ClassValue;
}

export function Badge(props: BadgeProps) {
	return <div class={clsx('bg-100 text-muted px-2 py-0.5 line-height-1 rounded text-sm w-max', props.class)}>{props.children}</div>;
}
