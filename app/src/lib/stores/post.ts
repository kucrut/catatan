import type { Changes } from './changes';
import type { WP_REST_API_Post } from 'wp-types';
import type { PostTypeStore } from './post-type';
import api_fetch, { type APIFetchOptions } from '@wordpress/api-fetch';
import create_permission_store, { type Permission } from './permission';
import with_params, { type WithParams } from './with-params';
import { derived, writable, type Readable } from 'svelte/store';

interface Params {
	post_id?: number;
	type?: PostTypeStore;
}

export interface Store< T > extends Readable< T >, Omit< WithParams< Params >, 'subscribe' > {
	fetch(): Promise< void >;
	// eslint-disable-next-line no-unused-vars
	save( changes: Changes ): Promise< void >;
	trash(): Promise< void >;
}

export interface Post extends WP_REST_API_Post {
	__can__?: Permission;
}

function create_store(): Store< Post > {
	const post_store = writable< Post >();
	const params = with_params< Params >();

	let api_path: string;
	let path: string;
	let type_store: PostTypeStore;
	let $store: Post;

	params.subscribe( $params => {
		if ( ! $params ) {
			return;
		}

		const { post_id, type } = $params;

		if ( type && ! type_store ) {
			type_store = type;
			type_store.subscribe( $type => {
				if ( $type ) {
					api_path = `${ $type.rest_namespace }/${ $type.rest_base }`;
				}
			} );
		}

		if ( typeof post_id === 'undefined' ) {
			return;
		}

		const new_path = post_id > 0 ? `${ api_path }/${ post_id }` : api_path;

		if ( new_path === path ) {
			return;
		}

		path = new_path;
		permission_store.set_path( path );
		permission_store.fetch();
	} );

	const permission_store = create_permission_store( path );

	post_store.subscribe( $post => {
		// No data (post hasn't been fetched yet).
		if ( ! $post ) {
			return;
		}

		const { id } = $post;
		const { post_id } = params.get_params();

		if ( ! id || post_id === id ) {
			return;
		}

		// Handle transition from new -> edit.
		params.set_params( { post_id: id } );
	} );

	const store = derived< [ typeof post_store, typeof permission_store ], Post >(
		[ post_store, permission_store ],
		( [ $post_store, $permission ], set ) => {
			$store = {
				...$post_store,
				__can__: $permission,
			};

			set( $store );
		},
	);

	const fetch = async ( options?: APIFetchOptions ) => {
		const { post_id, type } = params.get_params();

		if ( typeof post_id === 'undefined' || ! type ) {
			throw new Error( '[Post store] Error: Params is not set.' );
		}

		const data = await api_fetch< Post >( {
			path: `${ path }?context=edit`,
			parse: true,
			...( options || {} ),
		} );

		return data;
	};

	return {
		...params,
		...store,

		async fetch() {
			const data = await fetch();
			post_store.update( $value => ( { ...$value, ...data } ) );
		},

		async save( changes: Changes ) {
			const data = await fetch( {
				data: changes,
				method: 'POST',
			} );

			post_store.update( $value => ( { ...$value, ...data } ) );
			// TODO
			// await permission_store.fetch();
		},

		async trash() {
			if ( ! $store.__can__.delete ) {
				throw new Error( 'You do not have permission to trash this post.' );
			}

			const data = await fetch( { method: 'DELETE' } );
			post_store.update( $value => ( { ...$value, ...data } ) );
		},
	};
}

export default create_store();
