import type { WP_REST_API_Term } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import { derived, writable, type Readable } from 'svelte/store';

export interface NewTerm {
	name: string;
	parent?: number;
}

export interface TermWithChildren extends WP_REST_API_Term {
	children?: WP_REST_API_Term[];
}

interface StoreValue {
	flat: WP_REST_API_Term[];
	sorted?: TermWithChildren[];
}

export interface TermsStore extends Readable< StoreValue > {
	// eslint-disable-next-line no-unused-vars
	create( data: NewTerm ): Promise< WP_REST_API_Term >;
	fetch(): Promise< void >;
}

function flat_to_nested( flat: TermWithChildren[] ): TermWithChildren[] {
	const map = {};
	const result = [];

	for ( let i = 0; i < flat.length; i += 1 ) {
		map[ flat[ i ].id ] = i;
		flat[ i ].children = [];
	}

	for ( let i = 0; i < flat.length; i += 1 ) {
		const term = flat[ i ];

		if ( term.parent > 0 ) {
			flat[ map[ term.parent ] ].children.push( term );
		} else {
			result.push( term );
		}
	}

	return result;
}

export default function create_store( api_url: string, is_hierarchical = false ): TermsStore {
	const terms = writable< WP_REST_API_Term[] >();
	const store = derived< typeof terms, StoreValue >( terms, ( $terms, set ) => {
		if ( ! $terms ) {
			set( { flat: [] } );
			return;
		}

		set( {
			flat: $terms,
			sorted: is_hierarchical ? flat_to_nested( $terms ) : undefined,
		} );
	} );

	return {
		...store,

		async create( data: NewTerm ): Promise< WP_REST_API_Term > {
			try {
				const new_term = await api_fetch< WP_REST_API_Term >( {
					url: api_url,
					body: JSON.stringify( data ),
					headers: { 'Content-Type': 'application/json; charset=UTF-8' },
					method: 'POST',
					parse: true,
				} );

				terms.update( $terms => [ ...$terms, new_term ] );

				return new_term;
			} catch ( error ) {
				throw error;
			}
		},

		async fetch(): Promise< void > {
			const data = await api_fetch< WP_REST_API_Term[] >( {
				parse: true,
				url: `${ api_url }?context=edit&per_page=100`,
			} );
			terms.update( () => data );
			// TODO: Fetch more.
		},
	};
}
