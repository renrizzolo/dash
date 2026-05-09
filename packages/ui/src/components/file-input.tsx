import { clsx } from 'clsx';
import type { InputProps } from './input';

export function FileInput(props: InputProps & { multiple?: boolean }) {
	// oxlint-disable-next-line no-unassigned-vars
	let ref: HTMLInputElement | undefined;

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const files = e.dataTransfer?.files;
		if (files && files.length > 0 && props.onChange) {
			// Create a synthetic event to pass the files to input's the onChange handler
			if (ref) {
				const dataTransfer = new DataTransfer();
				for (let i = 0; i < files.length; i++) {
					dataTransfer.items.add(files[i]);
				}
				ref.files = dataTransfer.files;
				ref.dispatchEvent(new Event('change', { bubbles: true }));
			}
		}
	};

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
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				class="w-full p-6 flex-col rounded-md border-inverse bg-50 flex items-center justify-center cursor-pointer hover:bg-100 focus-within:ring-default min-h-32"
			>
				<span class="text-sm font-medium text-muted border-inverse-dashed p-2 rounded-md">
					{props.multiple ? 'Choose files, drag or paste images here...' : 'Choose file, drag or paste image here...'}
				</span>
				<input ref={ref} {...props} type="file" class="sr-only" />
			</div>
			{props.error && <span class="text-xs text-error">{props.error}</span>}
		</div>
	);
}
