import { cloudflare } from '@cloudflare/vite-plugin';
import legacy from '@vitejs/plugin-legacy';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
	plugins: [
		solid(),
		cloudflare(),
		UnoCSS({ configDeps: ['../ui/src/styles/preset.ts'] }),
		legacy({
			targets: ['defaults', 'not IE 11'],
		}),
	],
});
