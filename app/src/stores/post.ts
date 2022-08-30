import type { Changes } from './changes';
import type { WP_REST_API_Post } from 'wp-types';
import api_fetch, { type APIFetchOptions } from '@wordpress/api-fetch';
import create_permission_store, { type Permission, type PermissionStore } from './permission';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface Post extends WP_REST_API_Post {
	__can__?: Permission;
}

export interface PostStore extends Readable< Post > {
	fetch(): Promise< void >;
	// eslint-disable-next-line no-unused-vars
	save( changes: Changes ): Promise< void >;
	trash(): Promise< void >;
}

export default function create_store( api_path: string, post_id: number ): PostStore {
	const path = `${ api_path }/${ post_id }`;
	const post_store = writable< Post >();

	let $store: Post;

	const permission_store = create_permission_store( path );
	permission_store.fetch();

	const store = derived< [ Writable< Post >, PermissionStore ], Post >(
		[ post_store, permission_store ],
		( [ $post_store, $permission ], set ) => {
			set( {
				...$post_store,
				__can__: $permission,
			} );
		},
	);

	store.subscribe( $value => ( $store = $value ) );

	const fetch = async ( options?: APIFetchOptions ): Promise< Post > => {
		const data = await api_fetch< Post >( {
			path: `${ path }?context=edit`,
			parse: true,
			...( options || {} ),
		} );

		return data;
	};

	return {
		...store,

		async fetch(): Promise< void > {
			const data = await fetch();
			post_store.update( $value => ( { ...$value, ...data } ) );
		},

		async save( changes: Changes ): Promise< void > {
			const data = await fetch( {
				data: changes,
				method: 'POST',
			} );

			post_store.update( $value => ( { ...$value, ...data } ) );
			await permission_store.fetch();
		},

		async trash(): Promise< void > {
			const { __can__ } = $store;

			if ( ! __can__.delete ) {
				throw new Error( 'You do not have permission to trash this post.' );
			}

			const data = await fetch( { method: 'DELETE' } );
			post_store.update( $value => ( { ...$value, ...data } ) );
		},
	};
}
