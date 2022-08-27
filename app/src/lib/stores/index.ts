import type { Config } from '$types';
import create_editor_store, { type EditorStore } from './editor';
import create_notices_store, { type NoticesStore } from './notices';
import create_post_store, { type PostStore } from './post';
import create_post_type_store, { type PostTypeStore } from './post-type';
import create_ui_store, { type UiStore } from './ui';

export type StoresConfig = Omit< Config, 'editor_id' | 'nonce' | 'rest_url' >;

export interface Stores {
	editor: EditorStore;
	notices: NoticesStore;
	post: PostStore;
	post_type: PostTypeStore;
	ui: UiStore;
}

let stores: Stores;

export async function init_stores( config: StoresConfig ): Promise< void > {
	const { post_id, post_type, ...editor_config } = config;

	const post_type_store = create_post_type_store( post_type );
	await post_type_store.fetch();

	const post = create_post_store( post_type_store, post_id );

	if ( post_id > 0 ) {
		await post.fetch();
	}

	const notices = create_notices_store();

	stores = {
		notices,
		post,
		editor: create_editor_store( {
			post,
			post_id,
			notices,
			post_type: post_type_store,
			...editor_config,
		} ),
		post_type: post_type_store,
		ui: create_ui_store(),
	};
}

export function get_store< K extends keyof Stores >( name: K ): Stores[ K ] {
	if ( ! stores ) {
		throw new Error( 'Stores have not been initialised.' );
	}

	if ( ! ( name in stores ) ) {
		throw new Error( 'Invalid store name' );
	}

	return stores[ name ];
}
