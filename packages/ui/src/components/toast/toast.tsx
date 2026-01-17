import clsx from 'clsx';
import { createContext, createEffect, createMemo, createSignal, For, JSX, Show, useContext } from 'solid-js';
import { Button } from '../button';
import { Card } from '../card';
import { Heading } from '../heading';
import './toast.css';

export type ToastProps = {
	id: string;
	title: string;
	message: string;
	variant: 'default' | 'error';
	action?: JSX.Element;
	durationMs?: number;
};
const defaultDurationMs = 3000;

function useToastContext() {
	const [toasts, setToasts] = createSignal<ToastProps[]>([]);
	const [lastCloseTime, setLastCloseTime] = createSignal(0);
	const [isPaused, setIsPaused] = createSignal(false);

	const timeoutIds = new Map<string, number>();

	function addToast(toast: Omit<ToastProps, 'id' | 'element'>) {
		const id = crypto.randomUUID();
		setToasts((prev) => [...prev, { id, ...toast }]);
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

	function handleMouseEnter() {
		clearTimeout(timeoutId);
		setIsExpanded(true);
		toastContext.setIsPaused(true);
	}

	function handleMouseLeave() {
		const timeSinceClose = Date.now() - toastContext.lastCloseTime();
		const delay = timeSinceClose < 500 ? 1000 : 250;

		timeoutId = setTimeout(() => {
			setIsExpanded(false);
			toastContext.setIsPaused(false);
		}, delay);
	}

	return (
		<ToastContext.Provider value={toastContext}>
			{props.children}
			<section
				class="fixed flex-row justify-center bottom-5 w-vw p-4 z-2"
				data-toast-container
				data-expanded={isExpanded()}
				aria-live="polite"
				aria-atomic="false"
				aria-relevant="additions text"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onFocusIn={handleMouseEnter}
				onFocusOut={handleMouseLeave}
			>
				<For each={toastContext.toasts()}>{(toast) => <Toast toast={toast} />}</For>
			</section>
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

	createEffect(() => {
		const allToasts = toasts();
		const index = allToasts.findIndex((t) => t.id === props.toast.id);
		const reverseIndex = allToasts.length - 1 - index;

		const newestToast = allToasts[allToasts.length - 1];
		const newestToastHeight = (document.querySelector(`[data-toast="${newestToast?.id}"]`) as HTMLElement)?.offsetHeight || 0;

		const collapsed = newestToastHeight - 18 + reverseIndex * 18;

		const expanded = allToasts.slice(index + 1).reduce((acc, curr) => {
			return acc + ((document.querySelector(`[data-toast="${curr.id}"]`) as HTMLElement)?.offsetHeight || 0) + 12;
		}, 0);

		setCoords({ collapsed, expanded });
	});

	const reverseIndex = createMemo(() => toasts().length - 1 - toasts().findIndex((t) => t.id === props.toast.id));

	return (
		<Card
			data-toast={props.toast.id}
			class={clsx(
				'absolute bottom-0  max-w-container w-full transition-all shadow-lg animate-fade-in',
				props.toast.variant === 'error' ? 'bg-error text-inverse' : 'bg-default text-default border-default'
			)}
			style={{
				'--toast-index': `${reverseIndex()}`,
				'--toast-offset': `${coords().collapsed}`,
				'--toast-offset-expanded': `${coords().expanded}`,
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
			<div>{props.toast.message}</div>
			{props.toast.action && <div class="mt-4">{props.toast.action}</div>}
		</Card>
	);
}
