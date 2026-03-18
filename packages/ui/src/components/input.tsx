import { clsx } from 'clsx';
import type { JSX } from 'solid-js';

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	containerClass?: string;
}

export function Input(props: InputProps) {
	return (
		<div class={clsx('flex-col gap-2 items-start w-full', props.containerClass)}>
			{props.label && (
				<label for={props.id} class="text-sm font-semibold text-muted">
					{props.label}
				</label>
			)}
			<input {...props} class={clsx('text-base w-full px-5 py-4 rounded-md border-inverse bg-50 focus:ring-default', props.class)} />
			{props.error && <span class="text-xs text-error">{props.error}</span>}
		</div>
	);
}
