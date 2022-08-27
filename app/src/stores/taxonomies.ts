import type { PostStore } from './post';
import type { WP_REST_API_Taxonomy } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface Permission {
	assign: boolean;
	create: boolean;
}

export interface Taxonomy extends WP_REST_API_Taxonomy {
	__can__: Permission;
}

export type Taxonomies = Taxonomy[];

export interface TaxonomiesStore extends Readable< Taxonomies > {
	fetch(): Promise< void >;
}

const actions = [ 'assign', 'create' ];

export default function create_store( post: PostStore ): TaxonomiesStore {
	const tax_store = writable< Taxonomies >();
	const store = derived< [ Writable< Taxonomies >, PostStore ], Taxonomies >(
		[ tax_store, post ],
		( [ $tax_store, $post ], set ) => {
			const { _links } = $post;

			const taxonomies = $tax_store.map( tax => {
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
	let post_type: string;

	post.subscribe( ( { type } ) => ( post_type = type ) );

	return {
		...store,

		async fetch(): Promise< void > {
			const data = await api_fetch< Taxonomies >( {
				parse: true,
				path: `/wp/v2/taxonomies?context=edit&type=${ post_type }`,
			} );

			tax_store.update( () => Object.values( data ) );
		},
	};
}
