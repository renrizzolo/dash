import { defineConfig } from '@unocss/vite';
import presetWebFonts from '@unocss/preset-web-fonts';
import { presetIcons } from '@unocss/preset-icons';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import { presetDash } from './src/styles/preset';
// import presetLegacyCompat from '@unocss/preset-legacy-compat';

export default defineConfig({
	transformers: [transformerVariantGroup()],
	presets: [
		presetWebFonts({
			provider: 'fontsource',
			fonts: {
				sans: 'TASA Orbiter',
				mono: 'Fira Code',
			},
		}),
		presetDash(),
		// presetMini(),
		presetIcons({
			extraProperties: {
				display: 'inline-block',
				'vertical-align': 'middle',
			},
			collections: {
				tabler: () => import('@iconify-json/tabler/icons.json').then((i) => i.default),
			},
		}),
		// presetLegacyCompat({
		// 	// options
		// 	commaStyleColorFunction: true,
		// 	legacyColorSpace: true,
		// }),
	],
});
