import type { PostStore } from './post';
import type { WP_REST_API_Taxonomies } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import { derived, writable, type Readable } from 'svelte/store';

export interface Permission {
	assign: boolean;
	create: boolean;
}

export interface TaxonomiesStore extends Readable< WP_REST_API_Taxonomies > {
	fetch(): Promise< void >;
}

export default function create_store( post: PostStore ): TaxonomiesStore {
	const tax_store = writable< WP_REST_API_Taxonomies >();
	const store = derived( tax_store, $tax_store => $tax_store );
	let post_type: string;

	post.subscribe( ( { type } ) => {
		post_type = type;
	} );

	return {
		...store,

		async fetch(): Promise< void > {
			if ( ! post_type ) {
				return;
			}

			const data = await api_fetch< WP_REST_API_Taxonomies >( {
				parse: true,
				path: `/wp/v2/taxonomies?context=edit&type=${ post_type }`,
			} );

			tax_store.update( () => data );
		},
	};
}
