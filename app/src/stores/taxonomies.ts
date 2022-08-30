import type { PostStore } from './post';
import type { WP_REST_API_Taxonomy } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import create_terms_store, { type TermsStore } from './terms';
import sort_by from 'just-sort-by';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface Permission {
	assign: boolean;
	create: boolean;
}

export interface Taxonomy extends WP_REST_API_Taxonomy {
	__can__: Permission;
}

export interface TaxTerms {
	taxonomy: string;
	terms: TermsStore;
}

export type Taxonomies = Taxonomy[];

export interface TaxonomiesStore extends Readable< Taxonomies > {
	fetch(): Promise< void >;
	// eslint-disable-next-line no-unused-vars
	get_terms_store( tax_name: string ): TermsStore | undefined;
}

const actions = [ 'assign', 'create' ];

export default function create_store( post: PostStore ): TaxonomiesStore {
	const tax_store = writable< Taxonomies >();
	const tax_terms: TaxTerms[] = [];

	const get_terms_store = ( tax_name: string ): TermsStore | undefined => {
		const found = tax_terms.find( ( { taxonomy } ) => taxonomy === tax_name );

		return found ? found.terms : undefined;
	};

	const store = derived< [ Writable< Taxonomies >, PostStore ], Taxonomies >(
		[ tax_store, post ],
		( [ $tax_store, $post ], set ) => {
			if ( ! ( $tax_store && $post ) ) {
				return;
			}

			const { _links } = $post;

			const taxonomies = $tax_store.map( tax => {
				// console.log( tax );

				const { rest_base } = tax;
				const permissions = actions.map( action => {
					const key = `wp:action-${ action }-${ rest_base }`;
					return [ action, key in _links ];
				} );

				return {
					...tax,
					__can__: Object.fromEntries( permissions ),
				};
			} );

			set( taxonomies );
		},
	);

	store.subscribe( $taxonomies => {
		if ( ! $taxonomies ) {
			return;
		}

		$taxonomies.forEach( ( { hierarchical, slug, __can__, _links } ) => {
			if ( ! __can__.assign ) {
				return;
			}

			const found = get_terms_store( slug );

			if ( found ) {
				return;
			}

			const terms_store = create_terms_store( _links[ 'wp:items' ][ 0 ].href, hierarchical );

			tax_terms.push( {
				taxonomy: slug,
				terms: terms_store,
			} );
		} );
	} );

	let post_type: string;

	post.subscribe( ( { type } ) => ( post_type = type ) );

	return {
		...store,

		get_terms_store,

		async fetch(): Promise< void > {
			const data = await api_fetch< Taxonomies >( {
				parse: true,
				path: `/wp/v2/taxonomies?context=edit&type=${ post_type }`,
			} );

			const sorted = sort_by( Object.values( data ), ( { labels } ) => labels.name.toLowerCase() );

			tax_store.update( () => sorted );
		},
	};
}
