import { writable, type Readable } from 'svelte/store';

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

export type Notices = Notice[];

export interface NoticesStore extends Readable< Notices > {
	// eslint-disable-next-line no-unused-vars
	add( item: Notice ): void;
	// eslint-disable-next-line no-unused-vars
	remove( item_id: Notice[ 'id' ] ): void;
}

function remove_item( $items: Notices, item_id: Notice[ 'id' ] ) {
	return $items.filter( ( { id } ) => item_id !== id );
}

function create_store(): NoticesStore {
	const { update, ...store } = writable< Notices >( [] );

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

export default create_store();
