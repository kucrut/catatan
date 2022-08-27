import type { WP_REST_API_Taxonomies } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import { derived, writable, type Readable } from 'svelte/store';

export interface TaxonomiesStore extends Readable< WP_REST_API_Taxonomies > {
	fetch(): Promise< void >;
}

export default function create_store(): TaxonomiesStore {
	const tax_store = writable< WP_REST_API_Taxonomies >();
	const store = derived( tax_store, $tax_store => $tax_store );

	return {
		...store,

		async fetch() {
			const data = await api_fetch< WP_REST_API_Taxonomies >( {
				parse: true,
				path: `/wp/v2/taxonomies?context=edit`,
			} );

			tax_store.update( () => data );
		},
	};
}
