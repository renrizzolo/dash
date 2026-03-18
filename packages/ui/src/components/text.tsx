import clsx from 'clsx';

const baseClass = 'font-sans';

export function Text(props: { whiteSpace?: 'normal' | 'pre-wrap' | 'nowrap'; children: string }) {
	return (
		<p
			class={clsx(
				baseClass,
				props.whiteSpace
					? {
							'white-space-normal': props.whiteSpace === 'normal',
							'white-space-pre-wrap': props.whiteSpace === 'pre-wrap',
							'white-space-nowrap': props.whiteSpace === 'nowrap',
						}
					: null,
			)}
		>
			{props.children}
		</p>
	);
}
