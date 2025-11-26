import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import legacy from '@vitejs/plugin-legacy';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
	plugins: [
		solid(),
		cloudflare(),
		legacy({
			targets: ['defaults', 'not IE 11'],
		}),
	],
});
