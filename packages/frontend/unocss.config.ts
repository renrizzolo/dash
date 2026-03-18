import { presetDash } from 'ui/preset';
import { transformerVariantGroup } from 'unocss';
import { defineConfig } from 'unocss/vite';

export default defineConfig({
	// @ts-expect-error no time for this
	transformers: [transformerVariantGroup()],
	// @ts-expect-error no time for this
	presets: presetDash(),
});
