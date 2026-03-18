import clsx from 'clsx';
import { createContext, createEffect, createMemo, createSignal, For, JSX, useContext } from 'solid-js';
import { Button } from '../button';
import { Card } from '../card';
import { Heading } from '../heading';
import './toast.css';
import { Text } from '../text';

export type ToastProps = {
	id: string;
	title: string;
	message: string;
	variant: 'default' | 'error';
	action?: JSX.Element;
	durationMs?: number;
};

const defaultDurationMs = 30000;
const maxToasts = 10;

function useToastContext() {
	const [toasts, setToasts] = createSignal<ToastProps[]>([]);
	const [lastCloseTime, setLastCloseTime] = createSignal(0);
	const [isPaused, setIsPaused] = createSignal(false);

	const timeoutIds = new Map<string, number>();

	function addToast(toast: Omit<ToastProps, 'id' | 'element'>) {
		const id = crypto.randomUUID();

		setToasts((prev) => {
			if (prev.length >= maxToasts) {
				// remove the oldest toast and add the new one
				const updatedToasts = prev.slice(1);
				return [...updatedToasts, { id, ...toast }];
			}
			return [...prev, { id, ...toast }];
		});
	}

	function removeToast(id: string) {
		const timeoutId = timeoutIds.get(id);
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutIds.delete(id);
		}
		setLastCloseTime(Date.now());
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}

	createEffect(() => {
		const paused = isPaused();
		const currentToasts = toasts();

		if (paused) {
			timeoutIds.forEach((id) => clearTimeout(id));
			timeoutIds.clear();
		} else {
			currentToasts.forEach((toast) => {
				if (toast.durationMs !== 0 && !timeoutIds.has(toast.id)) {
					const timeoutId = setTimeout(() => removeToast(toast.id), toast.durationMs ?? defaultDurationMs);
					timeoutIds.set(toast.id, timeoutId);
				}
			});
		}
	});

	return {
		toasts,
		addToast,
		removeToast,
		lastCloseTime,
		setIsPaused,
	};
}

const ToastContext = createContext<ReturnType<typeof useToastContext> | null>(null);

export function ToastProvider(props: { children: JSX.Element }) {
	const toastContext = useToastContext();

	const [isExpanded, setIsExpanded] = createSignal(false);
	let timeoutId: number;

	function handlePointerEnter() {
		clearTimeout(timeoutId);
		setIsExpanded(true);
		toastContext.setIsPaused(true);
	}

	function handlePointerLeave(event: PointerEvent | FocusEvent) {
		const timeSinceClose = Date.now() - toastContext.lastCloseTime();
		const delay = timeSinceClose < 500 ? 1000 : 250;
		const container = event.currentTarget as HTMLElement;
		timeoutId = setTimeout(() => {
			// if the pointer is still inside the container, do not collapse
			if (container && container.matches(':hover')) {
				return;
			}

			setIsExpanded(false);
			toastContext.setIsPaused(false);
		}, delay);
	}

	return (
		<ToastContext.Provider value={toastContext}>
			{props.children}
			<section
				class="fixed flex-row justify-center bottom-5 w-vw z-2"
				data-toast-container
				data-expanded={isExpanded()}
				aria-live="polite"
				aria-atomic="false"
				aria-relevant="additions text"
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
				onFocusIn={handlePointerEnter}
				onFocusOut={handlePointerLeave}
			>
				<For each={toastContext.toasts()}>{(toast) => <Toast toast={toast} />}</For>
			</section>
			{/* this is a mask/pointer area behind the toasts; 
				anchor positioned to the oldest toast's top */}
			<div
				class="fixed"
				style={{
					'position-anchor': '--toast-anchor',
					bottom: 0,
					width: '640px',
					top: 'calc(anchor(top) - 20px)',
					left: 'calc(50%)',
					right: '100%',
					transform: 'translateX(-50%)',
				}}
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
			/>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}

	return context;
}

function Toast(props: { toast: ToastProps }) {
	const { removeToast, toasts } = useToast();

	const [coords, setCoords] = createSignal({ collapsed: 0, expanded: 0 });
	const index = createMemo(() => toasts().findIndex((t) => t.id === props.toast.id));

	createEffect(() => {
		const allToasts = toasts();
		const toastIndex = index();
		if (toastIndex === -1) return;

		const newestToast = allToasts[allToasts.length - 1];
		const newerToasts = allToasts.slice(toastIndex + 1);

		const newestHeight = (document.querySelector(`[data-toast="${newestToast.id}"]`) as HTMLElement)?.offsetHeight || 0;
		const myHeight = (document.querySelector(`[data-toast="${props.toast.id}"]`) as HTMLElement)?.offsetHeight || 0;

		// Expanded logic: total height of newer toasts + gaps
		const expanded = newerToasts.reduce((acc, curr) => {
			const height = (document.querySelector(`[data-toast="${curr.id}"]`) as HTMLElement)?.offsetHeight || 0;
			return acc + height + 12;
		}, 0);

		// Collapsed logic: exactly 18px between each toast top
		const collapsed = newestHeight - myHeight + newerToasts.length * 18;

		setCoords({ collapsed, expanded });
	});

	const reverseIndex = createMemo(() => toasts().length - 1 - index());

	return (
		<Card
			data-toast={props.toast.id}
			class={clsx(
				'flex-col gap-1 absolute bottom-0 max-w-container transition-all shadow-lg animate-slide-in w-bound',
				props.toast.variant === 'error' ? 'bg-error text-inverse' : 'bg-default text-default border-default',
			)}
			style={{
				'--toast-index': `${reverseIndex()}`,
				'--toast-offset': `${coords().collapsed}`,
				'--toast-offset-expanded': `${coords().expanded}`,
				// TODO - this isn't necessarily the highest toast, as an older one that's taller could be above it
				'anchor-name': index() === 0 ? '--toast-anchor' : undefined,
				'z-index': reverseIndex() === 0 ? 1 : undefined,
			}}
			variant={props.toast.variant}
		>
			<Button
				variant="ghost"
				size="icon-small"
				rounded="full"
				type="button"
				class="absolute top-3 right-3"
				onClick={() => removeToast(props.toast.id)}
				aria-label="Close"
			>
				<span class="i-tabler:x w-5 h-5" aria-hidden="true"></span>
			</Button>
			<Heading level={2}>{props.toast.title}</Heading>
			<Text whiteSpace="pre-wrap">{props.toast.message}</Text>
			{props.toast.action && <div class="mt-4">{props.toast.action}</div>}
		</Card>
	);
}
