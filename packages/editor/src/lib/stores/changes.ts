import { localStorage, persist } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import type { BetterOmit } from '$types';
import type { WP_REST_API_Post } from 'wp-types';

export interface Changes extends BetterOmit< Partial< WP_REST_API_Post >, 'content' | 'excerpt' | 'title' > {
	content?: string;
	excerpt?: string;
	title?: string;
}

export default function create_store( post_id: number ) {
	const store = persist( writable< Changes >( {} ), localStorage(), `catatan-changes-${ post_id }` );

	window.addEventListener( 'unload', () => {
		store.delete();
	} );

	return store;
}
