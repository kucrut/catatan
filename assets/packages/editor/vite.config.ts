import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig( {
	build: {
		manifest: true,
		polyfillModulePreload: false,
		rollupOptions: {
			input: 'src/main.ts',
		},
	},
	plugins: [ svelte() ],
	resolve: {
		alias: {
			$lib: resolve( 'src/lib' ),
			$types: resolve( 'src/types' ),
		},
	},
} );
