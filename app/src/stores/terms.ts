import type { WP_REST_API_Term } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import { derived, writable, type Readable } from 'svelte/store';

export interface NewTerm {
	name: string;
	parent?: number;
}

export interface TermsStore extends Readable< WP_REST_API_Term[] > {
	// eslint-disable-next-line no-unused-vars
	create( data: NewTerm ): Promise< WP_REST_API_Term >;
	fetch(): Promise< void >;
}

export default function create_store( url: string ): TermsStore {
	const terms_store = writable< WP_REST_API_Term[] >();
	const store = derived( terms_store, $terms_store => $terms_store );

	return {
		...store,

		async create( data: NewTerm ): Promise< WP_REST_API_Term > {
			try {
				const new_term = await api_fetch< WP_REST_API_Term >( {
					url,
					body: JSON.stringify( data ),
					headers: { 'Content-Type': 'application/json; charset=UTF-8' },
					method: 'POST',
					parse: true,
				} );

				terms_store.update( $terms => [ new_term, ...$terms ] );

				return new_term;
			} catch ( error ) {
				throw error;
			}
		},

		async fetch(): Promise< void > {
			const data = await api_fetch< WP_REST_API_Term[] >( {
				parse: true,
				url: `${ url }?context=edit&per_page=100`,
			} );
			terms_store.update( () => data );
			// TODO: Fetch more.
		},
	};
}
