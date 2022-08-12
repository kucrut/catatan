import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import create_config from '@kucrut/vite-for-wp';

const config = create_config( 'src/main.ts', 'dist', {
	plugins: [ svelte() ],
	resolve: {
		alias: {
			$lib: resolve( 'src/lib' ),
			$types: resolve( 'src/types' ),
		},
	},
} );

export default config;
