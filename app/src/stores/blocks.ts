import type { Editor } from '@tiptap/core';
import { writable, type Writable } from 'svelte/store';

export interface Blocks {
	edited_link: null | string;
	editor?: Editor;
}

export type BlocksStore = Writable< Blocks >;

export default function create_store(): BlocksStore {
	return writable< Blocks >( { edited_link: null } );
}
