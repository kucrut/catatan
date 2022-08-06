import { persist, localStorage } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import api_fetch from '@wordpress/api-fetch';
import type { Config } from '$types';
import type { WP_REST_API_Post } from 'wp-types';

type Post = Partial< WP_REST_API_Post >;

interface Changes extends Omit< Post, 'content' | 'title' > {
	content?: string;
	title?: string;
}

export interface DocumentStoreValue {
	data: Changes;
	is_dirty: boolean;
}

export type DocumentStore = ReturnType< typeof create_document_store >;

export type DocumentStoreParams = Omit< Config, 'editor_id' | 'l10n' >;

function create_original_post_store( post_id: number, rest_path: string ) {
	const store = writable< Post >( {} );
	let api_path = rest_path;

	if ( post_id > 0 ) {
		api_path = `${ rest_path }/${ post_id }`;
	}

	api_path = `${ api_path }?context=edit`;

	const original_store = {
		...store,
		async fetch() {
			const data = await api_fetch( { path: api_path } );
			this.update( () => data );
		},
	};

	if ( post_id > 0 ) {
		original_store.fetch();
	}

	return original_store;
}

export default function create_document_store( { nonce, post_id, rest_path, rest_url }: DocumentStoreParams ) {
	api_fetch.use( api_fetch.createRootURLMiddleware( rest_url ) );
	api_fetch.use( api_fetch.createNonceMiddleware( nonce ) );

	const original = create_original_post_store( post_id, rest_path );

	const { update, ...store } = persist(
		writable< DocumentStoreValue >( {
			data: {},
			is_dirty: false,
		} ),
		localStorage(),
		`catatan-document-${ post_id }`,
	);

	original.subscribe( ( { content, title } ) => {
		update( () => ( {
			data: {
				content: content?.raw || '',
				title: title?.raw || '',
			},
			is_dirty: false,
		} ) );
	} );

	return {
		...store,

		clear_changes() {
			update( ( value: DocumentStoreValue ) => ( {
				...value,
				changes: {},
				is_dirty: false,
			} ) );
		},

		set_original( data: Post ) {
			original.set( data );
		},

		update( changes: Changes ) {
			update( ( { data, ...rest }: DocumentStoreValue ) => ( {
				...rest,
				data: {
					...data,
					...changes,
				},
				is_dirty: true,
			} ) );
		},
	};
}
