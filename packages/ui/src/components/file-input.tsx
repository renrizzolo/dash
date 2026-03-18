import { clsx } from 'clsx';
import type { InputProps } from './input';

export function FileInput(props: InputProps) {
	// oxlint-disable-next-line no-unassigned-vars
	let ref!: HTMLInputElement;

	return (
		<div class={clsx('flex-col gap-2 items-start w-full', props.containerClass)}>
			{props.label && (
				<label for={props.id} class="text-sm font-semibold text-muted">
					{props.label}
				</label>
			)}
			{/* can still be triggered via focusing the input */}
			{/* 
			    oxlint-disable-next-line click-events-have-key-events 
			{/* oxlint-disable-next-line no-static-element-interactions */}
			<div
				onClick={() => ref?.click()}
				class="w-full p-6 flex-col rounded-md border-inverse bg-50 flex items-center justify-center cursor-pointer hover:bg-100 focus-within:ring-default"
			>
				<span class="text-sm font-medium text-muted border-inverse-dashed p-2 rounded-md">Choose file...</span>
				<input ref={ref} {...props} type="file" class="sr-only" />
			</div>
			{props.error && <span class="text-xs text-error">{props.error}</span>}
		</div>
	);
}
