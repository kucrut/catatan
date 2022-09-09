import type { Editor } from '@tiptap/core';
import { writable, type Writable } from 'svelte/store';

export interface Blocks {
	editor?: Editor;
}

export type BlocksStore = Writable< Blocks >;

export default function create_store(): BlocksStore {
	return writable< Blocks >( {} );
}
