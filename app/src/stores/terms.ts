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

// Credit: https://stackoverflow.com/a/31384614
function flat_to_hierarchy( flat: TermWithChildren[] ): TermWithChildren[] {
	const keyed_by_id = Object.fromEntries( flat.map( term => [ term.id, term ] ) );
	const result: TermWithChildren[] = [];

	Object.values( keyed_by_id ).forEach( item => {
		const parent = Number( item.parent );

		if ( parent === 0 ) {
			result.push( item );
		} else if ( parent in keyed_by_id ) {
			const p = keyed_by_id[ parent ];

			if ( ! ( 'children' in p ) ) {
				p.children = [];
			}

			p.children.push( item );
		}
	} );

	return result;
}

export default function create_store( api_url: string, is_hierarchical = false ): TermsStore {
	const terms_store = writable< WP_REST_API_Term[] >();
	const store = derived< typeof terms_store, StoreValue >( terms_store, ( $terms, set ) => {
		const flat = $terms || [];

		if ( ! ( is_hierarchical && $terms ) ) {
			set( { flat } );
			return;
		}

		set( {
			flat,
			sorted: flat_to_hierarchy( flat ),
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

				terms_store.update( $terms => [ new_term, ...$terms ] );

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
			terms_store.update( () => data );
			// TODO: Fetch more.
		},
	};
}
