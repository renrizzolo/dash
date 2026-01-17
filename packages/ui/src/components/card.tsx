import { clsx, type ClassValue } from 'clsx';
import { JSX, splitProps } from 'solid-js';
import { createVariant } from '../styles/createVariant';

type CardVariants = {
	variant?: 'default' | 'inverse' | 'error';
	highlight?: boolean;
};
export type CardProps = {
	children: JSX.Element;
	class?: ClassValue;
} & CardVariants;

const variantStyles = createVariant<CardVariants>({
	variant: {
		default: 'bg-white text-current shadow-lg',
		error: 'bg-error text-inverse',
		inverse: 'bg-800 text-inverse',
	},
	highlight: { true: 'outline-highlight', false: '' },
});

export function Card(props: CardProps & JSX.HTMLAttributes<HTMLDivElement>) {
	const [local, rest] = splitProps(props, ['style', 'class', 'children', 'variant']);

	return (
		<div
			class={clsx('font-sans rounded-xl p-5 text-left flex-col border-default font-medium', local.class, variantStyles(props))}
			style={{
				// TODO these vars don't exist yet
				// '--text-current': local.variant === 'inverse' ? 'var(--text-inverse)' : 'var(--text-default)',
				...(local.style as Record<string, string>),
			}}
			{...rest}
		>
			{local.children}
		</div>
	);
}
