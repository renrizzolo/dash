import { definePreset } from 'unocss';

const spacingRem: Record<string, number> = {
	'0': 0,
	'1': 0.25,
	'2': 0.5,
	'3': 0.75,
	'4': 1,
};

export const presetDash = () =>
	definePreset(() => {
		return {
			name: 'preset-dash',
			theme: {
				colors: {
					text: {
						default: '#000000',
						muted: '#666666',
						inverse: '#FFFFFF',
					},
					background: {
						default: '#FFFFFF',
						muted: '#F0F0F0',
						inverse: '#000000',
					},
					border: {
						default: '#DDDDDD',
					},
				},
				fontFamily: {
					sans: [
						'ui-sans-serif',
						'system-ui',
						'-apple-system',
						'BlinkMacSystemFont',
						'"Segoe UI"',
						'Roboto',
						'"Helvetica Neue"',
						'Arial',
						'"Noto Sans"',
						'sans-serif',
						'"Apple Color Emoji"',
						'"Segoe UI Emoji"',
						'"Segoe UI Symbol"',
						'"Noto Color Emoji"',
					].join(', '),
				},
				fontSize: {
					// [size, line-height]
					xs: ['0.75rem', '1rem'],
					sm: ['0.875rem', '1.25rem'],
					base: ['1rem', '1.5rem'],
					lg: ['1.125rem', '1.75rem'],
					xl: ['1.25rem', '1.75rem'],
					'2xl': ['1.5rem', '2rem'],
				} satisfies Record<keyof typeof spacingRem, [string, string]>,
				spacing: {
					...spacingRem,
				},
			},
			rules: [
				['flex-col', { display: 'flex', 'flex-direction': 'column' }],
				['flex-row', { display: 'flex', 'flex-direction': 'row' }],

				['items-start', { 'align-items': 'flex-start' }],
				['items-center', { 'align-items': 'center' }],
				['items-end', { 'align-items': 'flex-end' }],
				['items-baseline', { 'align-items': 'baseline' }],
				['items-stretch', { 'align-items': 'stretch' }],

				['justify-start', { 'justify-content': 'flex-start' }],
				['justify-center', { 'justify-content': 'center' }],
				['justify-end', { 'justify-content': 'flex-end' }],
				['justify-between', { 'justify-content': 'space-between' }],
				['justify-around', { 'justify-content': 'space-around' }],
				['justify-evenly', { 'justify-content': 'space-evenly' }],

				['flex-grow', { 'flex-grow': '1' }],
				['flex-shrink', { 'flex-shrink': '1' }],
				['flex-grow-0', { 'flex-grow': '0' }],
				['flex-shrink-0', { 'flex-shrink': '0' }],

				['grid', { display: 'grid' }],
				[
					/^grid-cols-(\d+)$/,
					([, d]) => ({ 'grid-template-columns': `repeat(${d}, minmax(0, 1fr))` }),
					{ autocomplete: 'grid-cols-<num>' },
				],
				['grid-cols-auto', { 'grid-template-columns': `repeat(auto-fit, minmax(0, 1fr))` }],
				[/^grid-cols-auto-(.+)$/, ([, size]) => ({ 'grid-template-columns': `repeat(auto-fit, minmax(${size}, 1fr))` })],

				['w-full', { width: '100%' }],
				['h-full', { height: '100%' }],
				['w-min', { width: 'min-content' }],
				['h-max', { height: 'max-content' }],

				// spacing
				...Object.entries(spacingRem)
					.map(
						([key, value]) =>
							[
								// Padding
								[`p-${key}`, { padding: `${value}rem` }],
								[`pe-${key}`, { 'padding-inline-end': `${value}rem` }],
								[`ps-${key}`, { 'padding-inline-start': `${value}rem` }],
								[`pt-${key}`, { 'padding-top': `${value}rem` }],
								[`px-${key}`, { 'padding-inline': `${value}rem` }],
								[`pb-${key}`, { 'padding-bottom': `${value}rem` }],
								// Margin
								[`m-${key}`, { margin: `${value}rem` }], // Added generic margin utility for completeness
								[`me-${key}`, { 'margin-inline-end': `${value}rem` }],
								[`ms-${key}`, { 'margin-inline-start': `${value}rem` }],
								[`mx-${key}`, { 'margin-inline': `${value}rem` }],
								[`mt-${key}`, { 'margin-top': `${value}rem` }],
								[`mb-${key}`, { 'margin-bottom': `${value}rem` }],

								[`gap-${key}`, { gap: `${value}rem` }],
							] as [string, Record<string, string>][]
					)
					.flat(),
				[
					/^font-(.+)$/,
					([, match], { theme }) => ({ 'font-family': theme.fontFamily?.[match as keyof typeof theme.fontFamily] }),
					{ autocomplete: 'font-$fontFamily' },
				],
				[
					/^text-(.+)$/,
					([, match], { theme }) => ({
						'font-size': theme.fontSize?.[match as keyof typeof theme.fontSize]?.[0],
						'line-height': theme.fontSize?.[match as keyof typeof theme.fontSize]?.[1],
					}),
					{ autocomplete: 'text-$fontSize' },
				],

				['text-strike', { 'text-decoration': 'line-through' }],

				[
					/^bg-(.+)$/,
					([, color], { theme }) => ({
						'background-color': theme.colors?.background?.[color as keyof (typeof theme.colors)['background']],
					}),
					{ autocomplete: 'bg-$colors' },
				],
				[
					/^text-(.+)$/,
					([, color], { theme }) => ({ color: theme.colors?.text?.[color as keyof (typeof theme.colors)['text']] }),
					{ autocomplete: 'text-$colors' },
				],

				[/^rounded-(\d+)/, ([, size], { theme }) => ({ 'border-radius': theme.spacing?.[size] + 'rem' })],

				[
					/^border-(.+)/,
					([, color], { theme }) => ({ border: `1px solid ${theme.colors?.border?.[color as keyof (typeof theme.colors)['border']]}` }),
				],

				[
					/^ring-(.+)/,
					([, color], { theme }) => ({
						'box-shadow': `0 0 0 3px ${theme.colors?.border?.[color as keyof (typeof theme.colors)['border']]}`,
						outline: 'none',
					}),
					{ autocomplete: 'ring-$colors' },
				],
			],

			shortcuts: [
				[
					// TODO - make this use the gap scale from theme.spacing
					/^stack-(center|start|end)-(\d+)$/,
					([, alignment, size]) => `flex-col items-${alignment} justify-${alignment} gap-${size}`,
					{ autocomplete: ['stack-center-$spacing', 'stack-start-$spacing', 'stack-end-$spacing'] },
				],
			],

			variants: [
				(matcher) => {
					if (matcher.startsWith('hover:')) {
						return {
							matcher: matcher.slice(6),
							selector: (s) => `${s}:hover`,
						};
					}

					if (matcher.startsWith('focus:')) {
						return {
							matcher: matcher.slice(6),
							selector: (s) => `${s}:focus-visible`,
						};
					}

					if (matcher.startsWith('hocus:')) {
						return {
							matcher: matcher.slice(6),
							selector: (s) => `${s}:hover, ${s}:focus-visible`,
						};
					}

					if (matcher.startsWith('active:')) {
						return {
							matcher: matcher.slice(8),
							selector: (s) => `${s}:active, ${s}[data-active]`,
						};
					}

					return null;
				},
			],
		};
	});
