// oxlint-disable no-explicit-any
import { definePreset, presetIcons, presetWebFonts } from 'unocss';

export const presetDash = () => [
	definePreset(() => {
		return {
			name: 'preset-dash',
			theme: {
				colors: {
					text: {
						default: '#000000',
						muted: '#404040',
						inverse: '#FFFFFF',
						'inverse-muted': '#A3A3A3',
					},
					background: {
						default: '#FFFFFF',
						muted: '#d4d4d4',
						inverse: '#000000',
						'inverse-muted': '#262626',
						50: '#fafafa',
						100: '#f5f5f5',
						200: '#e5e5e5',
						300: '#d4d4d4',
						400: '#a3a3a3',
						500: '#737373',
						600: '#525252',
						700: '#404040',
						800: '#262626',
						900: '#171717',
					},
					border: {
						default: '#DDDDDD',
						highlight: '#404040',
						inverse: '#333333',
					},
					accent: {
						default: '#ff5722',
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
					mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'].join(
						', '
					),
				},
				breakpoints: {
					sm: '640px',
					md: '768px',
					lg: '1024px',
					xl: '1280px',
				},
				spacing: {
					'0': '0',
					'0.5': '0.125rem',
					'1': '0.25rem',
					'1.5': '0.375rem',
					'2': '0.5rem',
					'2.5': '0.625rem',
					'3': '0.75rem',
					'3.5': '0.875rem',
					'4': '1rem',
					'5': '1.25rem',
					'6': '1.5rem',
					'7': '1.75rem',
					'8': '2rem',
					'9': '2.25rem',
					'10': '2.5rem',
					'12': '3rem',
					'14': '3.5rem',
					'16': '4rem',
					'20': '5rem',
					'24': '6rem',
					'32': '8rem',
					'40': '10rem',
					'48': '12rem',
					'56': '14rem',
					'64': '16rem',
				},
				size: {
					container: '600px',
					fit: 'fit-content',
					min: 'min-content',
					max: 'max-content',
					full: '100%',
					vw: '100vw',
					vh: '100vh',
				},
			},
			rules: [
				// Layout
				['block', { display: 'block' }],
				['inline-block', { display: 'inline-block' }],
				['inline', { display: 'inline' }],
				['hidden', { display: 'none' }],

				['flex-col', { display: 'flex', 'flex-direction': 'column' }],
				['flex-row', { display: 'flex', 'flex-direction': 'row' }],
				['flex-wrap', { 'flex-wrap': 'wrap' }],

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
				['flex-1', { flex: '1 1 0%' }],
				['flex-auto', { flex: '1 1 auto' }],
				['flex-none', { flex: 'none' }],

				['grid', { display: 'grid' }],
				[
					/^grid-cols-(\d+)$/,
					([, d]) => ({ 'grid-template-columns': `repeat(${d}, minmax(0, 1fr))` }),
					{ autocomplete: 'grid-cols-<num>' },
				],
				['grid-cols-auto', { 'grid-template-columns': `repeat(auto-fit, minmax(0, 1fr))` }],
				[/^grid-cols-auto-(.+)$/, ([, size]) => ({ 'grid-template-columns': `repeat(auto-fit, minmax(${size}, 1fr))` })],

				// Sizing
				['min-h-screen', { 'min-height': '100vh' }],

				[/^w-(.*)/, ([, d], { theme }) => ({ width: theme.size?.[d as keyof typeof theme.size] || d })],
				[/^min-w-(.*)$/, ([, d], { theme }) => ({ 'min-width': theme.size?.[d as keyof typeof theme.size] })],
				[/^max-w-(.*)$/, ([, d], { theme }) => ({ 'max-width': theme.size?.[d as keyof typeof theme.size] || d })],

				[/^h-(.*)$/, ([, d], { theme }) => ({ height: theme.size?.[d as keyof typeof theme.size] })],
				[/^min-h-(.*)$/, ([, d], { theme }) => ({ 'min-height': theme.size?.[d as keyof typeof theme.size] })],
				[/^max-h-(.*)$/, ([, d], { theme }) => ({ 'max-height': theme.size?.[d as keyof typeof theme.size] })],

				// Positioning
				['absolute', { position: 'absolute' }],
				['relative', { position: 'relative' }],
				['fixed', { position: 'fixed' }],
				['sticky', { position: 'sticky' }],
				[
					/^inset-(\d+)$/,
					([, d], { theme }) => ({ inset: theme.spacing?.[d as keyof typeof theme.spacing] }),
					{
						autocomplete: 'inset-$spacing',
					},
				],
				[
					/^top-(\d+)$/,
					([, d], { theme }) => ({ top: theme.spacing?.[d as keyof typeof theme.spacing] }),
					{
						autocomplete: 'top-$spacing',
					},
				],
				[
					/^bottom-(\d+)$/,
					([, d], { theme }) => ({ bottom: theme.spacing?.[d as keyof typeof theme.spacing] }),
					{
						autocomplete: 'bottom-$spacing',
					},
				],
				[
					/^left-(\d+)$/,
					([, d], { theme }) => ({ left: theme.spacing?.[d as keyof typeof theme.spacing] }),
					{
						autocomplete: 'left-$spacing',
					},
				],
				[
					/^right-(\d+)$/,
					([, d], { theme }) => ({ right: theme.spacing?.[d as keyof typeof theme.spacing] }),
					{
						autocomplete: 'right-$spacing',
					},
				],
				[/^z-(\d+)$/, ([, d]) => ({ 'z-index': d })],

				// Spacing
				[
					/^p-(\d+)$/,
					([, d], { theme }) => ({ padding: theme.spacing?.[d as keyof typeof theme.spacing] || d }),
					{
						autocomplete: 'p-$spacing',
					},
				],
				[
					/^px-(\d+)$/,
					([, d], { theme }) => ({
						'padding-left': theme.spacing?.[d as keyof typeof theme.spacing] || d,
						'padding-right': theme.spacing?.[d as keyof typeof theme.spacing] || d,
					}),
					{
						autocomplete: 'px-$spacing',
					},
				],
				[
					/^py-(\d+)$/,
					([, d], { theme }) => ({
						'padding-top': theme.spacing?.[d as keyof typeof theme.spacing] || d,
						'padding-bottom': theme.spacing?.[d as keyof typeof theme.spacing] || d,
					}),
					{
						autocomplete: 'py-$spacing',
					},
				],
				[
					/^pt-(\d+)$/,
					([, d], { theme }) => ({ 'padding-top': theme.spacing?.[d as keyof typeof theme.spacing] || d }),
					{
						autocomplete: 'pt-$spacing',
					},
				],
				[
					/^pb-(\d+)$/,
					([, d], { theme }) => ({ 'padding-bottom': theme.spacing?.[d as keyof typeof theme.spacing] || d }),
					{
						autocomplete: 'pb-$spacing',
					},
				],
				[
					/^ps-(\d+)$/,
					([, d], { theme }) => ({ 'padding-inline-start': theme.spacing?.[d as keyof typeof theme.spacing] || d }),
					{
						autocomplete: 'ps-$spacing',
					},
				],
				[
					/^pe-(\d+)$/,
					([, d], { theme }) => ({ 'padding-inline-end': theme.spacing?.[d as keyof typeof theme.spacing] || d }),
					{
						autocomplete: 'pe-$spacing',
					},
				],

				[
					/^m-(\d+)$/,
					([, d], { theme }) => ({ margin: theme.spacing?.[d as keyof typeof theme.spacing] || d }),
					{
						autocomplete: 'm-$spacing',
					},
				],
				[
					/^mx-(\d+)$/,
					([, d], { theme }) => ({
						'margin-left': theme.spacing?.[d as keyof typeof theme.spacing] || d,
						'margin-right': theme.spacing?.[d as keyof typeof theme.spacing] || d,
					}),
					{
						autocomplete: 'mx-$spacing',
					},
				],
				[
					/^my-(\d+)$/,
					([, d], { theme }) => ({
						'margin-top': theme.spacing?.[d as keyof typeof theme.spacing] || d,
						'margin-bottom': theme.spacing?.[d as keyof typeof theme.spacing] || d,
					}),
					{
						autocomplete: 'my-$spacing',
					},
				],
				[
					/^mt-(\d+)$/,
					([, d], { theme }) => ({ 'margin-top': theme.spacing?.[d as keyof typeof theme.spacing] || d }),
					{
						autocomplete: 'mt-$spacing',
					},
				],
				[
					/^mb-(\d+)$/,
					([, d], { theme }) => ({ 'margin-bottom': theme.spacing?.[d as keyof typeof theme.spacing] || d }),
					{
						autocomplete: 'mb-$spacing',
					},
				],
				[
					/^ms-(\d+)$/,
					([, d], { theme }) => ({ 'margin-inline-start': theme.spacing?.[d as keyof typeof theme.spacing] || d }),
					{
						autocomplete: 'ms-$spacing',
					},
				],
				[
					/^me-(\d+)$/,
					([, d], { theme }) => ({ 'margin-inline-end': theme.spacing?.[d as keyof typeof theme.spacing] || d }),
					{
						autocomplete: 'me-$spacing',
					},
				],

				['mx-auto', { 'margin-left': 'auto', 'margin-right': 'auto' }],
				['my-auto', { 'margin-top': 'auto', 'margin-bottom': 'auto' }],

				[
					/^gap-(\d+)$/,
					([, d], { theme }) => ({ gap: theme.spacing?.[d as keyof typeof theme.spacing] }),
					{ autocomplete: 'gap-$spacing' },
				],

				// Typography
				[
					/^font-(.+)$/,
					([, match], { theme }) => ({ 'font-family': theme.fontFamily?.[match as keyof typeof theme.fontFamily] }),
					{ autocomplete: 'font-$fontFamily' },
				],
				['font-bold', { 'font-weight': '700' }],
				['font-semibold', { 'font-weight': '600' }],
				['font-medium', { 'font-weight': '500' }],
				['font-normal', { 'font-weight': '400' }],
				['font-light', { 'font-weight': '300' }],
				['italic', { 'font-style': 'italic' }],

				['text-left', { 'text-align': 'left' }],
				['text-center', { 'text-align': 'center' }],
				['text-right', { 'text-align': 'right' }],

				['uppercase', { 'text-transform': 'uppercase' }],
				['lowercase', { 'text-transform': 'lowercase' }],
				['capitalize', { 'text-transform': 'capitalize' }],

				['underline', { 'text-decoration': 'underline' }],
				['no-underline', { 'text-decoration': 'none' }],
				['text-strike', { 'text-decoration': 'line-through' }],

				[
					/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl)$/,
					([, size]) => {
						const sizes = {
							xs: ['0.75rem', '1rem'],
							sm: ['0.875rem', '1.25rem'],
							base: ['1rem', '1.5rem'],
							lg: ['1.125rem', '1.75rem'],
							xl: ['1.25rem', '1.75rem'],
							'2xl': ['1.5rem', '2rem'],
							'3xl': ['1.875rem', '2.25rem'],
							'4xl': ['2.25rem', '2.5rem'],
						};
						const s = sizes[size as keyof typeof sizes];
						return { 'font-size': s[0], 'line-height': s[1] };
					},
				],
				[
					/^text-(.+)$/,
					([, c], { theme }) => {
						if (theme.colors.text[c as keyof typeof theme.colors.text])
							return { color: theme.colors.text[c as keyof typeof theme.colors.text] };
					},
					{ autocomplete: 'text-$colors.text' },
				],
				[
					/^bg-(.+)$/,
					([, c], { theme }) => {
						if (theme.colors.background?.[c as keyof typeof theme.colors.background])
							return { 'background-color': theme.colors.background[c as keyof typeof theme.colors.background] };
					},
					{ autocomplete: 'bg-$colors.background' },
				],

				// Borders & Rounded
				['rounded-none', { 'border-radius': '0px' }],
				['rounded-sm', { 'border-radius': '0.125rem' }],
				['rounded', { 'border-radius': '0.25rem' }],
				['rounded-md', { 'border-radius': '0.375rem' }],
				['rounded-lg', { 'border-radius': '0.5rem' }],
				['rounded-xl', { 'border-radius': '0.75rem' }],
				['rounded-2xl', { 'border-radius': '1rem' }],
				['rounded-full', { 'border-radius': '9999px' }],
				[
					/^border-(.+)/,
					([, c], { theme }) => {
						if (theme.colors.border?.[c as keyof typeof theme.colors.border]) {
							return { border: `1px solid ${theme.colors.border[c as keyof typeof theme.colors.border]}` };
						}
					},
				],
				[
					/^ring-(.+)/,
					([, c], { theme }) => {
						if (theme.colors.border?.[c as keyof typeof theme.colors.border]) {
							return { 'box-shadow': `0 0 0 3px ${theme.colors.border[c as keyof typeof theme.colors.border]}`, outline: 'none' };
						}
					},
				],

				// Visuals
				['shadow-sm', { 'box-shadow': '0 1px 2px 0 rgb(0 0 0 / 0.05)' }],
				['shadow', { 'box-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }],
				['shadow-md', { 'box-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }],
				['shadow-lg', { 'box-shadow': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }],
				['cursor-pointer', { cursor: 'pointer' }],
				['cursor-default', { cursor: 'default' }],
				['cursor-not-allowed', { cursor: 'not-allowed' }],

				['object-cover', { 'object-fit': 'cover' }],
				['object-contain', { 'object-fit': 'contain' }],

				['aspect-square', { 'aspect-ratio': '1 / 1' }],
				['aspect-video', { 'aspect-ratio': '16 / 9' }],

				[/^opacity-(\d+)$/, ([, d]) => ({ opacity: Number(d) / 100 })],

				// Animations
				['animate-spin', { animation: 'spin 1.5s linear infinite' }],
				['animate-blip', { animation: 'blip 1.5s ease infinite' }],

				// Outline
				['outline-none', { outline: 'none' }],
				[
					/^outline-highlight$/,
					(_, { theme }) => ({
						'outline-style': 'dashed',
						'outline-offset': '3px',
						'outline-width': '2px',
						'outline-color': theme.colors.border.highlight,
					}),
				],
			],

			preflights: [
				{
					getCSS: () => `
										@keyframes blip {
											0%, 100% { opacity: 0; transform: scale(1); }
											50% { opacity: 1; transform: scale(0.8); }
										}
										@keyframes spin {
											0% { transform: rotate(90deg) scaleY(1); }
											50% { transform: rotate(90deg) scaleY(-1); }
											100% { transform: rotate(90deg) scaleY(1); }
										}
									`,
				},
			],

			shortcuts: [
				[
					/^stack-(center|start|end|stretch)-(\d+)$/,
					([, alignment, size]) => `flex-col items-${alignment} gap-${size}`,
					{ autocomplete: ['stack-center-$spacing', 'stack-start-$spacing', 'stack-end-$spacing', 'stack-justify-$spacing'] },
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

					if (matcher.startsWith('active:')) {
						return {
							matcher: matcher.slice(7),
							selector: (s) => `${s}:active, ${s}[data-active="true"], ${s}.active`,
						};
					}

					if (matcher.startsWith('hocus:')) {
						return {
							matcher: matcher.slice(6),
							selector: (s) => `${s}:hover, ${s}:focus-visible`,
						};
					}

					const breakpoints = {
						sm: '640px',
						md: '768px',
						lg: '1024px',
						xl: '1280px',
					};

					for (const [bp, size] of Object.entries(breakpoints)) {
						if (matcher.startsWith(`${bp}:`)) {
							return {
								matcher: matcher.slice(bp.length + 1),
								parent: `@media (min-width: ${size})`,
							};
						}
					}

					return null;
				},
			],
		};
	}),
	presetWebFonts({
		provider: 'fontsource',
		fonts: {
			sans: 'TASA Orbiter',
			mono: 'Fira Code',
		},
	}),
	presetIcons({
		extraProperties: {
			display: 'inline-block',
			'vertical-align': 'middle',
		},
		collections: {
			tabler: () => import('@iconify-json/tabler/icons.json').then((i) => i.default),
		},
	}),
];
