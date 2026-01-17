import { clsx } from 'clsx';
import type { JSX } from 'solid-js';

export interface TextAreaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	containerClass?: string;
}

export function TextArea(props: TextAreaProps) {
	return (
		<div class={clsx('flex-col gap-2 items-start w-full', props.containerClass)}>
			{props.label && (
				<label for={props.id} class="text-sm font-semibold text-muted">
					{props.label}
				</label>
			)}
			<textarea {...props} class={clsx('w-full px-4 py-4 rounded-md border-inverse bg-50 focus:ring-default', props.class)} />
			{props.error && <span class="text-xs text-accent">{props.error}</span>}
		</div>
	);
}
