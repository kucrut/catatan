import api_fetch, { type APIFetchOptions } from '@wordpress/api-fetch';
import { writable } from 'svelte/store';
import type { WP_REST_API_Post as Post, WP_REST_API_Type as Type } from 'wp-types';
import type { Changes } from '$types';

const actions = {
	create: 'POST',
	read: 'GET',
	update: 'PUT',
	delete: 'DELETE',
};

export default function create_store( post_id: number, type: Type ) {
	const { set, update, ...store } = writable< Partial< Post > >( {} );
	const api_path = `${ type.rest_namespace }/${ type.rest_base }`;

	let allow_list: string[] = [];
	let path: string;

	// Handle transition from new -> edit.
	store.subscribe( ( { id } ) => {
		path = api_path;

		if ( post_id > 0 || id > 0 ) {
			path = `${ path }/${ post_id || id }`;
		}

		path = `${ path }?context=edit`;
	} );

	const fetch = async ( options?: APIFetchOptions ) => {
		const response = await api_fetch< Promise< Response > >( {
			path,
			parse: false,
			...( options || {} ),
		} );
		const data = await response.json();

		allow_list = response.headers
			.get( 'allow' )
			.split( ',' )
			.map( method => method.trim() );

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
			set( data );
		},

		async save( changes: Changes ) {
			const data = await fetch( {
				data: changes,
				method: 'POST',
			} );

			update( () => data );
		},

		async trash() {
			const data = await fetch( { method: 'DELETE' } );
			update( () => data );
		},

		user_can( action: keyof typeof actions ) {
			return allow_list.includes( actions[ action ] );
		},
	};
}

export type PostStore = ReturnType< typeof create_store >;
