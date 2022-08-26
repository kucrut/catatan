import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import create_config from '@kucrut/vite-for-wp';

const config = create_config( 'app/src/main.ts', 'app/dist', {
	plugins: [ svelte() ],
	resolve: {
		alias: {
			$lib: resolve( 'app/src/lib' ),
			$types: resolve( 'app/src/types' ),
		},
	},
} );

export default config;
