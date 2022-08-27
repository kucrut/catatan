import type { Changes } from './changes';
import type { WP_REST_API_Post } from 'wp-types';
import type { PostTypeStore } from './post-type';
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

export default function create_store( post_type_store: PostTypeStore, post_id: number ): PostStore {
	const post_store = writable< Post >();

	let api_path: string;
	let path: string;
	let $store: Post;

	const permission_store = create_permission_store( path );

	const update_path = (): void => {
		path = `${ api_path }/${ post_id }`;

		permission_store.set_path( path );
		permission_store.fetch();
	};

	post_type_store.subscribe( ( { rest_base, rest_namespace } ) => {
		api_path = `${ rest_namespace }/${ rest_base }`;
		update_path();
	} );

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
