import { derived, writable } from 'svelte/store';
import api_fetch from '@wordpress/api-fetch';
import type { WP_REST_API_Taxonomies } from 'wp-types';

interface Params {
	post_type: string;
}

function create_store() {
	const tax_store = writable< WP_REST_API_Taxonomies >();
	const store = derived( tax_store, $tax_store => $tax_store );
	const params = writable< Params >( { post_type: '' } );
	let $params: Params;

	params.subscribe( $value => ( $params = $value ) );

	return {
		...store,

		set_params( arg: Params ) {
			params.update( () => arg );
		},

		async fetch() {
			if ( ! $params.post_type ) {
				throw new Error( '[Taxonomies store] Error: Post type is not set.' );
			}

			const data = await api_fetch< WP_REST_API_Taxonomies >( {
				parse: true,
				path: `/wp/v2/taxonomies/?type=${ $params.post_type }?context=edit`,
			} );

			tax_store.update( () => data );
		},
	};
}

export default create_store();
