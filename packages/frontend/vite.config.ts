import { cloudflare } from '@cloudflare/vite-plugin';
import legacy from '@vitejs/plugin-legacy';
// import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
	// resolve: {
	// 	alias: {
	// 		ui: resolve(__dirname, '../ui/src'),
	// 	},
	// },
	plugins: [
		solid(),
		// 	{
		// 	include: [resolve(__dirname, './src/**/*'), resolve(__dirname, '../ui/**/*')],
		// }

		cloudflare(),
		UnoCSS(),
		legacy({
			targets: ['defaults', 'not IE 11'],
		}),
	],
	// ssr: {
	// 	// Tells Vite to treat this package as source code instead of an external dependency
	// 	noExternal: ['ui'],
	// },
	// optimizeDeps: {
	// 	// Prevents Vite from trying to pre-bundle the uncompiled package
	// 	include: [resolve(__dirname, '../ui/src')],
	// },
});
