import { presetDash } from 'ui/preset';
import { transformerVariantGroup } from 'unocss';
import { defineConfig } from 'unocss/vite';

export default defineConfig({
	transformers: [transformerVariantGroup()],
	presets: presetDash(),
});
