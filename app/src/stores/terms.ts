import type { WP_REST_API_Term } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import { derived, writable, type Readable } from 'svelte/store';

export interface TermsStore extends Readable< WP_REST_API_Term[] > {
	fetch(): Promise< void >;
}

export default function create_store( url: string ): TermsStore {
	const terms_store = writable< WP_REST_API_Term[] >();
	const store = derived( terms_store, $terms_store => $terms_store );

	return {
		...store,

		async fetch(): Promise< void > {
			const data = await api_fetch< WP_REST_API_Term[] >( {
				parse: true,
				url: `${ url }?context=edit&per_page=100`,
			} );
			terms_store.update( () => data );
		},
	};
}
