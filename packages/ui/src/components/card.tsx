import { clsx, type ClassValue } from 'clsx';
import type { JSX } from 'solid-js';
import { createVariant } from '../styles/createVariant';

type CardVariants = {
	variant: 'default' | 'highlight';
	mode: 'light' | 'dark';
};
export type CardProps = {
	children: JSX.Element;
	class?: ClassValue;
} & CardVariants;

const variantStyles = createVariant<CardVariants>({
	mode: {
		dark: 'bg-800 text-inverse',
		light: 'bg-white text-default',
	},
	variant: {
		default: '',
		// TODO compound variant styles; these are dark only
		highlight: 'bg-inverse outline-highlight',
	},
});

export function Card(props: CardProps) {
	console.log(variantStyles(props));
	return <div class={clsx('rounded-lg p-4 text-left flex-col font-medium', variantStyles(props), props.class)}>{props.children}</div>;
}
