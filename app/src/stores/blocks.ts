import { writable, type Writable } from 'svelte/store';

export interface Blocks {
	active_block: string;
}

export type BlocksStore = Writable< Blocks >;

export default function create_store(): BlocksStore {
	return writable< Blocks >( {
		active_block: '',
	} );
}
