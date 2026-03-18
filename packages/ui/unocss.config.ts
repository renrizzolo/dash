import transformerVariantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from '@unocss/vite';
import { presetDash } from './src/styles/preset';
// import presetLegacyCompat from '@unocss/preset-legacy-compat';

export default defineConfig({
	// @ts-expect-error no time for this
	transformers: [transformerVariantGroup()],
	presets: presetDash(),

	// presetLegacyCompat({
	// 	// options
	// 	commaStyleColorFunction: true,
	// 	legacyColorSpace: true,
	// }),
});
