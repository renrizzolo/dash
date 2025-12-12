import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import legacy from '@vitejs/plugin-legacy';
import { cloudflare } from '@cloudflare/vite-plugin';
import UnoCSS from 'unocss/vite';

export default defineConfig({
	plugins: [
		UnoCSS(),
		solid(),
		cloudflare(),
		legacy({
			targets: ['defaults', 'not IE 11'],
		}),
	],
});
