import UnocssPlugin from '@unocss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
	plugins: [
		UnocssPlugin({
			configFile: './unocss.config.js',
		}),
		solidPlugin(),
	],
	server: {
		port: 3000,
	},
	build: {
		target: 'esnext',
	},
});
