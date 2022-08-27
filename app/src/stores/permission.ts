import type { MapToBoolean } from '$types';
import api_fetch from '@wordpress/api-fetch';
import { writable, type Readable } from 'svelte/store';

const actions = {
	create: 'POST',
	delete: 'DELETE',
	read: 'GET',
	update: 'PUT',
};

export type Permission = MapToBoolean< typeof actions >;

export interface PermissionStore extends Readable< Permission > {
	fetch(): Promise< void >;
}

export default function create_store( api_path: string ): PermissionStore {
	const { update, ...store } = writable< Permission >( {
		create: false,
		delete: false,
		read: false,
		update: false,
	} );

	return {
		...store,

		async fetch(): Promise< void > {
			try {
				const response = await api_fetch< Response >( {
					method: 'OPTIONS',
					parse: false,
					path: `/${ api_path }?context=edit`,
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
	};
}
