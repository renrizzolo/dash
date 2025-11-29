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
			<header class="header">
				<div class="header-start">{headerStart}</div>
				<div class="header-end">
					<span class="countdown">{headerEnd}</span>
				</div>
			</header>
			<section>{content}</section>
			{footer && <footer>{footer}</footer>}
		</>
	);
}
