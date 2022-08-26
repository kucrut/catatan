import { derived, writable, type Readable } from 'svelte/store';
import api_fetch from '@wordpress/api-fetch';
import type { WP_REST_API_Taxonomies } from 'wp-types';
import with_params from './with-params';

interface Params {
	post_type: string;
}

export interface Store< T > extends Readable< T > {
	fetch(): Promise< void >;
}

function create_store() {
	const tax_store = writable< WP_REST_API_Taxonomies >();
	const store = derived( tax_store, $tax_store => $tax_store );
	const params = with_params< Params >();

	return {
		...store,
		...params,

		async fetch() {
			const { post_type } = this.get_params();

			if ( ! post_type ) {
				throw new Error( '[Taxonomies store] Error: Post type is not set.' );
			}

			const data = await api_fetch< WP_REST_API_Taxonomies >( {
				parse: true,
				path: `/wp/v2/taxonomies/?type=${ post_type }?context=edit`,
			} );

			tax_store.update( () => data );
		},
	};
}

export default create_store();
