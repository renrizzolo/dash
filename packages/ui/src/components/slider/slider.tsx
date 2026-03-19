import { createSignal, For, type JSX } from 'solid-js';
import './slider.css';

export function Slider(props: { children: JSX.Element[] }) {
	const [activeIndex, setActiveIndex] = createSignal(0);
	// oxlint-disable-next-line no-unassigned-vars
	let containerRef: HTMLDivElement | undefined;

	const handleScroll = (e: Event & { currentTarget: HTMLDivElement }) => {
		const index = Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth);
		if (index !== activeIndex()) {
			setActiveIndex(index);
		}
	};

	return (
		<div class="relative w-full h-full">
			<div
				ref={containerRef}
				onScroll={handleScroll}
				data-slider-container
				class="relative w-full h-full flex-row overflow-scroll rounded-lg"
			>
				<For each={props.children}>
					{(child, index) => (
						<div data-index={index()} class="w-full h-full flex-shrink-0">
							{child}
						</div>
					)}
				</For>
			</div>
			<div class="absolute bottom-4 items-center justify-center w-full flex-row gap-1.5">
				<For each={props.children}>
					{(_, index) => (
						<button
							type="button"
							onClick={() => {
								containerRef
									?.querySelector(`[data-index="${index()}"]`)
									?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
							}}
							class="rounded-full active:w-3.5 hocus:bg-inverse active:bg-inverse border-default transition-all duration-200 bg-100 cursor-pointer w-2.5 h-2.5"
							data-active={activeIndex() === index()}
							aria-label={`Go to slide ${index() + 1}`}
						></button>
					)}
				</For>
			</div>
		</div>
	);
}
