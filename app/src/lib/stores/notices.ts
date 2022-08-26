import { writable } from 'svelte/store';

export interface Notice {
	content: string;
	dismissible?: boolean;
	id: string;
	link?: {
		text: string;
		url: string;
	};
	type: 'error' | 'info' | 'snack';
}

function remove_item( $items: Notice[], item_id: Notice[ 'id' ] ) {
	return $items.filter( ( { id } ) => item_id !== id );
}

export default function create_store() {
	const { update, ...store } = writable< Notice[] >( [] );

	return {
		...store,

		add( item: Notice ) {
			update( $items => [ ...remove_item( $items, item.id ), item ] );
		},

		remove( item_id: Notice[ 'id' ] ) {
			update( $items => remove_item( $items, item_id ) );
		},
	};
}

export type NoticesStore = ReturnType< typeof create_store >;
