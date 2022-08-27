import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { wp_globals } from '@kucrut/vite-for-wp/utils';
import create_config from '@kucrut/vite-for-wp';
import external_globals from 'rollup-plugin-external-globals';

const config = create_config( 'app/src/main.ts', 'app/dist', {
	plugins: [ external_globals( wp_globals() ), svelte() ],
	resolve: {
		alias: {
			$lib: resolve( 'app/src/lib' ),
			$types: resolve( 'app/src/types' ),
		},
	},
} );

export default config;