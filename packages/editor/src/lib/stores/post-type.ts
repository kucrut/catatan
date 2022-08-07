import { derived, writable } from 'svelte/store';
import api_fetch from '@wordpress/api-fetch';
import type { WP_REST_API_Type } from 'wp-types';

export default function create_store( post_type: string ) {
	const type_store = writable< WP_REST_API_Type >( null );

	const store = derived( type_store, $type_store => $type_store );

	return {
		...store,

		async fetch() {
			const data = await api_fetch< WP_REST_API_Type >( {
				parse: true,
				path: `/wp/v2/types/${ post_type }?context=edit`,
			} );
			type_store.update( () => data );
		},
	};
}

export type PostTypeStore = ReturnType< typeof create_store >;
