import { clsx, type ClassValue } from 'clsx';
import type { JSX } from 'solid-js';
import { createVariant } from '../styles/createVariant';

type ButtonVariants = {
	variant?: 'default' | 'ghost' | 'outline' | 'primary';
	rounded?: 'default' | 'full';
	size?: 'default' | 'small' | 'icon' | 'icon-small';
};

export type ButtonProps = {
	children: JSX.Element;
	class?: ClassValue;
	onClick?: (e: MouseEvent) => void;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	'aria-label'?: string;
	'aria-pressed'?: boolean;
	ref?: (el: HTMLButtonElement) => void;
} & Partial<ButtonVariants>;

export const buttonVariantStyles = createVariant<ButtonVariants>({
	variant: {
		default: 'bg-white border-default hover:bg-200 text-default focus:ring-inverse active:(bg-inverse text-inverse)',
		ghost: 'hover:bg-100 text-current hover:text-default  focus:ring-inverse active:(bg-inverse text-inverse)',
		outline: 'bg-default border-default hover:bg-200 text-default focus:ring-inverse active:(bg-inverse text-inverse)',
		primary: 'bg-inverse border-transparent hover:bg-inverse-muted text-inverse focus:ring-default active:(bg-inverse text-inverse)',
	},
	size: {
		default: 'px-3 py-2 text-base',
		small: 'px-2 py-1 text-sm',
		icon: 'w-9 h-9 p-2 items-center justify-center',
		'icon-small': 'w-7 h-7 p-1 items-center justify-center',
	},
	rounded: {
		full: 'rounded-full',
		default: 'rounded-md',
	},
});

export function Button(props: ButtonProps) {
	return (
		<button
			ref={props.ref}
			type={props.type || 'button'}
			class={clsx(
				'items-center flex-row justify-center cursor-pointer',
				buttonVariantStyles({ variant: props.variant || 'default', size: props.size || 'default', rounded: props.rounded || 'default' }),
				'',
				props.class,
			)}
			onClick={props.onClick}
			aria-label={props['aria-label']}
			aria-pressed={props['aria-pressed']}
			disabled={props.disabled}
			data-active={props['aria-pressed'] ? 'true' : 'false'}
		>
			{props.children}
		</button>
	);
}
