import type { WP_REST_API_Taxonomies } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import with_params, { type WithParams } from './with-params';
import { derived, writable, type Readable } from 'svelte/store';

interface Params {
	post_type: string;
}

export interface TaxonomiesStore extends Readable< WP_REST_API_Taxonomies >, Omit< WithParams< Params >, 'subscribe' > {
	fetch(): Promise< void >;
}

function create_store(): TaxonomiesStore {
	const tax_store = writable< WP_REST_API_Taxonomies >();
	const store = derived( tax_store, $tax_store => $tax_store );
	const params = with_params< Params >();

	return {
		...params,
		...store,

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
