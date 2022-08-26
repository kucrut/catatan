import type { WP_REST_API_Type } from 'wp-types';
import api_fetch from '@wordpress/api-fetch';
import with_params, { type WithParams } from './with-params';
import { derived, writable, type Readable } from 'svelte/store';

interface Params {
	post_type: string;
}

export interface PostTypeStore extends Readable< WP_REST_API_Type >, Omit< WithParams< Params >, 'subscribe' > {
	fetch(): Promise< void >;
}

function create_store(): PostTypeStore {
	const type_store = writable< WP_REST_API_Type >();
	const store = derived( type_store, $type_store => $type_store );
	const params = with_params< Params >();

	return {
		...params,
		...store,

		async fetch() {
			const { post_type } = this.get_params();

			if ( ! post_type ) {
				throw new Error( '[Post type store] Error: Post type is not set.' );
			}

			const data = await api_fetch< WP_REST_API_Type >( {
				parse: true,
				path: `/wp/v2/types/${ post_type }?context=edit`,
			} );
			type_store.update( () => data );
		},
	};
}

export default create_store();
