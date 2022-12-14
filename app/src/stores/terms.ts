import type { WP_REST_API_Term } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import { derived, writable, type Readable } from 'svelte/store';
import { generate_url, type URLParams } from '$utils/url';

export interface NewTerm {
	name: string;
	parent?: number;
}

export interface TermWithChildren extends WP_REST_API_Term {
	children?: WP_REST_API_Term[];
}

export interface SlimTerm {
	id: number;
	name: string;
}

interface StoreValue {
	flat: WP_REST_API_Term[];
	sorted?: TermWithChildren[];
}

interface FetchParams {
	page?: number;
	include?: number[];
}

export interface TermsStore extends Readable< StoreValue > {
	add( term: WP_REST_API_Term ): void;
	create( data: NewTerm ): Promise< WP_REST_API_Term >;
	fetch( params?: FetchParams, more?: boolean ): Promise< void >;
	search( term: string ): Promise< WP_REST_API_Term[] >;
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

		if ( term.parent > 0 && flat[ map[ term.parent ] ] ) {
			flat[ map[ term.parent ] ].children.push( term );
		} else {
			result.push( term );
		}
	}

	return result;
}

export default function create_store( api_url: string, is_hierarchical = false ): TermsStore {
	const terms = writable< WP_REST_API_Term[] >( [] );
	const store = derived< typeof terms, StoreValue >( terms, ( $terms, set ) => {
		set( {
			flat: $terms,
			sorted: is_hierarchical ? flat_to_nested( $terms ) : undefined,
		} );
	} );

	return {
		...store,

		add( term: WP_REST_API_Term ): void {
			terms.update( $terms => [ ...$terms, term ] );
		},

		async create( data: NewTerm ): Promise< WP_REST_API_Term > {
			try {
				const new_term = await api_fetch< WP_REST_API_Term >( {
					url: api_url,
					body: JSON.stringify( data ),
					headers: { 'Content-Type': 'application/json; charset=UTF-8' },
					method: 'POST',
					parse: true,
				} );

				this.add( new_term );

				return new_term;
			} catch ( error ) {
				throw error;
			}
		},

		async fetch( params = {}, more = false ): Promise< void > {
			const { include, page = 1 } = params;
			const fetch_params: URLParams = {
				context: 'edit',
				page: `${ page }`,
				per_page: '100',
			};

			if ( include && include.length ) {
				fetch_params.include = include.map( i => i.toString() ).join( ',' );
			}

			const url = generate_url( api_url, fetch_params );
			const response = await api_fetch< Response >( { url, parse: false } );
			const data = await response.json();

			terms.update( $terms => ( page === 1 ? data : [ ...$terms, ...data ] ) );

			const total_pages = Number( response.headers.get( 'x-wp-totalpages' ) );

			if ( more && total_pages > page ) {
				this.fetch(
					{
						...params,
						page: page + 1,
					},
					more,
				);
			}
		},

		async search( search: string ): Promise< WP_REST_API_Term[] > {
			const data = await api_fetch< WP_REST_API_Term[] >( {
				parse: true,
				url: generate_url( api_url, {
					search,
					context: 'view',
					order: 'desc',
					orderby: 'count',
					per_page: '20',
				} ),
			} );

			// TODO: Fetch more?

			return data;
		},
	};
}
