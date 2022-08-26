import api_fetch, { type APIFetchOptions } from '@wordpress/api-fetch';
import create_permission_store, { type Permission } from './permission';
import { derived, writable } from 'svelte/store';
import type { Changes } from './changes';
import type { WP_REST_API_Post, WP_REST_API_Type as Type } from 'wp-types';

export interface Post extends WP_REST_API_Post {
	__can__?: Permission;
}

export default function create_store( post_id: number, type: Type ) {
	const api_path = `${ type.rest_namespace }/${ type.rest_base }`;
	const post_store = writable< Post >();

	let current_id = post_id;
	let path = current_id > 0 ? `${ api_path }/${ current_id }` : api_path;
	let $store: Post;

	const permission_store = create_permission_store( path );

	post_store.subscribe( $post => {
		// No data (post hasn't been fetched yet).
		if ( ! $post ) {
			return;
		}

		const { id } = $post;

		if ( ! id || current_id === id ) {
			return;
		}

		// Handle transition from new -> edit.
		current_id = id;
		path = `${ api_path }/${ id }`;
		permission_store.set_path( path );
		permission_store.fetch();
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
		const data = await api_fetch< Post >( {
			path: `${ path }?context=edit`,
			parse: true,
			...( options || {} ),
		} );

		// Don't fetch permission when we're saving for the first time,
		// as it will be done by the subscriber above after changing path.
		if ( ! ( current_id === 0 && options?.method === 'POST' ) ) {
			await permission_store.fetch();
		}

		return data;
	};

	return {
		...store,

		async fetch() {
			if ( post_id < 1 ) {
				// throw error?
				return;
			}

			const data = await fetch();
			post_store.update( $value => ( { ...$value, ...data } ) );
		},

		async save( changes: Changes ) {
			const data = await fetch( {
				data: changes,
				method: 'POST',
			} );

			post_store.update( $value => ( { ...$value, ...data } ) );
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

export type PostStore = ReturnType< typeof create_store >;
