import type { WP_REST_API_Media } from '$types';
import api_fetch from '@wordpress/api-fetch';
import { derived, writable, type Readable } from 'svelte/store';

/* eslint-disable no-unused-vars */
export interface MediaStore extends Readable< WP_REST_API_Media[] > {
	fetch( id: number ): Promise< WP_REST_API_Media >;
	get( media_id: number ): WP_REST_API_Media | Promise< WP_REST_API_Media >;
}
/* eslint-enable */

export default function create_store( api_path: string ): MediaStore {
	const media_store = writable< WP_REST_API_Media[] >( [] );
	const store = derived( media_store, $media_store => $media_store );

	let $store: WP_REST_API_Media[];

	media_store.subscribe( $value => ( $store = $value ) );

	return {
		...store,

		async fetch( id: number ): Promise< WP_REST_API_Media > {
			const data = await api_fetch< WP_REST_API_Media >( {
				path: `${ api_path }/${ id }`,
				parse: true,
			} );

			media_store.update( $items => [ ...$items, data ] );

			return data;
		},

		async get( media_id: number ): Promise< WP_REST_API_Media > {
			const item = $store.find( ( { id } ) => media_id === id );

			return item || this.fetch( media_id );
		},
	};
}
