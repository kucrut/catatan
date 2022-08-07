import api_fetch from '@wordpress/api-fetch';
import { writable } from 'svelte/store';
import type { WP_REST_API_Post as Post, WP_REST_API_Type as Type } from 'wp-types';
import type { Changes } from '$types';

export default function create_store( post_id: number, type: Type ) {
	const { set, update, ...store } = writable< Partial< Post > >( {} );
	const api_path = `${ type.rest_namespace }/${ type.rest_base }`;
	let path: string;

	// Handle transition from new -> edit.
	store.subscribe( ( { id } ) => {
		path = api_path;

		if ( post_id > 0 || id > 0 ) {
			path = `${ path }/${ post_id || id }`;
		}

		path = `${ path }?context=edit`;
	} );

	return {
		...store,

		async fetch() {
			if ( post_id < 1 ) {
				// throw error?
				return;
			}

			const data = await api_fetch< Post >( { path, parse: true } );
			set( data );
		},

		async save( changes: Changes ) {
			try {
				const data = await api_fetch< Post >( {
					path,
					data: changes,
					method: 'POST',
					parse: true,
				} );
				update( () => data );
			} catch ( error ) {
				throw error;
			}
		},
	};
}

export type PostStore = ReturnType< typeof create_store >;
