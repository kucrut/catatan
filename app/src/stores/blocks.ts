import type { Config } from '$types';
import type { Editor } from '@tiptap/core';
import { writable, type Writable } from 'svelte/store';

export type BlocksStoreParams = Pick< Config, 'block_alignments' | 'image_default_size' | 'image_size_names' >;

export interface Blocks extends BlocksStoreParams {
	edited_link: null | string;
	editor?: Editor;
}

export type BlocksStore = Writable< Blocks >;

export default function create_store( params: BlocksStoreParams ): BlocksStore {
	return writable< Blocks >( {
		...params,
		edited_link: null,
	} );
}
