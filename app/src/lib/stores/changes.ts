import type { BetterOmit } from '$types';
import type { WP_REST_API_Post } from 'wp-types';
import { createLocalStorage, persist, type PersistentStore } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export interface Changes extends BetterOmit< Partial< WP_REST_API_Post >, 'content' | 'excerpt' | 'title' > {
	content?: string;
	excerpt?: string;
	title?: string;
}

export type ChangesStore = PersistentStore< Changes >;

export default function create_store( post_id: number ): ChangesStore {
	const store = persist( writable< Changes >( {} ), createLocalStorage(), `catatan-changes-${ post_id }` );

	window.addEventListener( 'unload', () => {
		store.delete();
	} );

	return store;
}
