import { writable } from 'svelte/store';

export interface Notice {
	content: string;
	dismissible: boolean;
	id: string;
	type: 'error' | 'info';
}

export default function create_store() {
	const { update, ...store } = writable< Notice[] >( [] );

	return {
		...store,

		add( item: Notice ) {
			update( items => items.concat( item ) );
		},

		remove( item_id: Notice[ 'id' ] ) {
			update( items => items.filter( ( { id } ) => item_id !== id ) );
		},
	};
}

export type NoticesStore = ReturnType< typeof create_store >;
