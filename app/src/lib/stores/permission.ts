import { writable } from 'svelte/store';
import api_fetch from '@wordpress/api-fetch';
import type { MapToBoolean } from '$types';

const actions = {
	create: 'POST',
	delete: 'DELETE',
	read: 'GET',
	update: 'PUT',
};

export type Permission = MapToBoolean< typeof actions >;
export type PermissionStore = ReturnType< typeof create_store >;

export default function create_store( api_path: string ) {
	const { update, ...store } = writable< Permission >( {
		create: false,
		delete: false,
		read: false,
		update: false,
	} );

	let path = api_path;

	return {
		...store,

		async fetch() {
			try {
				const response = await api_fetch< Response >( {
					method: 'OPTIONS',
					parse: false,
					path: `${ path }?context=edit`,
				} );

				const allow_list = response.headers
					.get( 'allow' )
					.split( ',' )
					.map( method => method.trim() );

				update( () => {
					const new_entries = Object.entries( actions ).map( ( [ action, method ] ) => [
						action,
						allow_list.includes( method ),
					] );

					return Object.fromEntries( new_entries );
				} );
			} catch {}
		},

		set_path( new_path: string ) {
			path = new_path;
		},
	};
}
