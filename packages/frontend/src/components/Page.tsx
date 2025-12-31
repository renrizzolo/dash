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
			{headerStart ||
				(headerEnd && (
					<header class="header">
						{headerStart && <div class="header-start">{headerStart}</div>}
						{headerEnd && <div class="header-end">{headerEnd}</div>}
					</header>
				))}
			<section>{content}</section>
			{footer && <footer>{footer}</footer>}
		</>
	);
}
