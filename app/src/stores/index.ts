import type { Config } from '$types';
import create_editor_store, { type EditorStore } from './editor';
import create_notices_store, { type NoticesStore } from './notices';
import create_post_store, { type PostStore } from './post';
import create_post_type_store, { type PostTypeStore } from './post-type';
import create_taxonomies_store, { type TaxonomiesStore } from './taxonomies';
import create_ui_store, { type UiStore } from './ui';

export type StoresConfig = Omit< Config, 'editor_id' | 'nonce' | 'rest_url' >;

export interface Stores {
	editor: EditorStore;
	notices: NoticesStore;
	post: PostStore;
	post_type: PostTypeStore;
	taxonomies: TaxonomiesStore;
	ui: UiStore;
}

let stores: Stores;

export async function init_stores( config: StoresConfig ): Promise< void > {
	const { post_id, post_rest_path, post_type_rest_path, ...editor_config } = config;

	const post_type = create_post_type_store( post_type_rest_path );
	await post_type.fetch();

	const post = create_post_store( post_rest_path, post_id );
	await post.fetch();

	const taxonomies = create_taxonomies_store( post );
	await taxonomies.fetch();

	const notices = create_notices_store();

	stores = {
		notices,
		post,
		post_type,
		taxonomies,
		editor: create_editor_store( {
			...editor_config,
			notices,
			post,
			post_id,
			post_type,
		} ),
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
