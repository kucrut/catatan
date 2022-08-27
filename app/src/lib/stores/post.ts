import type { Changes } from './changes';
import type { WP_REST_API_Post } from 'wp-types';
import type { PostTypeStore } from './post-type';
import api_fetch, { type APIFetchOptions } from '@wordpress/api-fetch';
import create_permission_store, { type Permission, type PermissionStore } from './permission';
import with_get, { type WithGet } from './with-get';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface Post extends WP_REST_API_Post {
	__can__?: Permission;
}

export type PostStore = Readable< Post > &
	WithGet< Post > & {
		fetch(): Promise< void >;
		// eslint-disable-next-line no-unused-vars
		save( changes: Changes ): Promise< void >;
		trash(): Promise< void >;
	};

export default function create_store( post_type_store: PostTypeStore, post_id: number ): PostStore {
	const post_store = writable< Post >();

	let current_id = post_id;
	let api_path: string;
	let path: string;

	post_type_store.subscribe( ( { rest_base, rest_namespace } ) => {
		api_path = `${ rest_namespace }/${ rest_base }`;

		if ( ! path ) {
			path = api_path;
		}
	} );

	// params.subscribe( $params => {
	// 	if ( ! $params ) {
	// 		return;
	// 	}

	// 	const { post_id, type } = $params;

	// 	if ( type && ! type_store ) {
	// 		type_store = type;
	// 		type_store.subscribe( $type => {
	// 			if ( $type ) {
	// 				api_path = `${ $type.rest_namespace }/${ $type.rest_base }`;
	// 			}
	// 		} );
	// 	}

	// 	if ( typeof post_id === 'undefined' ) {
	// 		return;
	// 	}

	// 	const new_path = post_id > 0 ? `${ api_path }/${ post_id }` : api_path;

	// 	if ( new_path === path ) {
	// 		return;
	// 	}

	// 	path = new_path;
	// 	permission_store.set_path( path );
	// 	permission_store.fetch();
	// } );

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

		current_id = id;
		path = `${ api_path }/${ id }`;
		permission_store.set_path( path );
		permission_store.fetch();
	} );

	const store = with_get< Post >(
		derived< [ Writable< Post >, PermissionStore ], Post >(
			[ post_store, permission_store ],
			( [ $post_store, $permission ], set ) => {
				set( {
					...$post_store,
					__can__: $permission,
				} );
			},
		),
	);

	const fetch = async ( options?: APIFetchOptions ) => {
		const data = await api_fetch< Post >( {
			path: `${ path }?context=edit`,
			parse: true,
			...( options || {} ),
		} );

		return data;
	};

	return {
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
			const { __can__ } = this.get();

			if ( ! __can__.delete ) {
				throw new Error( 'You do not have permission to trash this post.' );
			}

			const data = await fetch( { method: 'DELETE' } );
			post_store.update( $value => ( { ...$value, ...data } ) );
		},
	};
}
