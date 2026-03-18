import type { JSXElement } from 'solid-js';

export function Page({
	headerStart,
	headerEnd,
	content,
	footer,
}: {
	headerStart: JSXElement;
	headerEnd?: JSXElement;
	content: JSXElement;
	footer?: JSXElement;
}) {
	return (
		<>
			{(headerStart || headerEnd) && (
				<header class="flex-row justify-between items-end mb-4">
					{headerStart && <div class="stack-start-1 text-left">{headerStart}</div>}
					{headerEnd && <div class="stack-end-1">{headerEnd}</div>}
				</header>
			)}
			<section>{content}</section>
			{footer && <footer>{footer}</footer>}
		</>
	);
}
