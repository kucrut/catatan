import type { Config } from '$types';
import editor from './editor';
import post from './post';
import post_type_store from './post-type';
import taxonomies from './taxonomies';

export async function init_stores( config: Config ) {
	const { post_id, post_type, ...editor_config } = config;

	post_type_store.set_params( { post_type } );
	await post_type_store.fetch();

	post.set_params( { post_id, type: post_type_store } );
	await post.fetch();

	taxonomies.set_params( { post_type } );
	await taxonomies.fetch();

	editor.set_params( {
		post_id,
		...editor_config,
	} );
}
