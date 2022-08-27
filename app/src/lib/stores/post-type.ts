import type { WP_REST_API_Type } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import with_get, { type WithGet } from './with-get';
import { derived, writable, type Readable } from 'svelte/store';

export type PostTypeStore = Readable< WP_REST_API_Type > & WithGet< WP_REST_API_Type > & { fetch(): Promise< void > };

export default function create_store( post_type: string ): PostTypeStore {
	const type_store = writable< WP_REST_API_Type >();
	const store = with_get< WP_REST_API_Type >( derived( type_store, $type_store => $type_store ) );

	return {
		...store,

		async fetch(): Promise< void > {
			const data = await api_fetch< WP_REST_API_Type >( {
				parse: true,
				path: `/wp/v2/types/${ post_type }?context=edit`,
			} );
			type_store.update( () => data );
		},
	};
}
