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

export interface EditorStoreValue {
	data: Changes;
	is_dirty: boolean;
	is_saved: boolean;
	is_saving: boolean;
	was_saving: boolean;
}

export type EditorStore = ReturnType< typeof create_document_store >;

export type EditorStoreParams = Pick< Config, 'edit_link_template' | 'post_id' | 'post_type' | 'rest_path' >;

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
			try {
				const data = await api_fetch( { parse: true, path: api_path } );
				this.update( () => data );
			} catch ( error ) {
				// TODO: Display error in notice section.
				// eslint-disable-next-line no-console
				console.error( error );
			}
		},

		async save( changes: Changes ) {
			try {
				const data = await api_fetch( {
					data: changes,
					method: post_id > 0 ? 'PATCH' : 'POST',
					parse: true,
					path: api_path,
				} );
				this.update( () => data );
			} catch ( error ) {
				throw error;
			}
		},
	};

	if ( post_id > 0 ) {
		original_store.fetch();
	}

	return original_store;
}

export default function create_document_store( { edit_link_template, post_id, rest_path }: EditorStoreParams ) {
	const changes_store = persist( writable< Changes >( {} ), localStorage(), `catatan-document-${ post_id }` );
	const original_store = create_original_post_store( post_id, rest_path );

	const { update, ...editor } = writable< EditorStoreValue >( {
		data: {},
		is_dirty: false,
		is_saved: false,
		is_saving: false,
		was_saving: false,
	} );

	// Update editor's data when original store value is updated.
	original_store.subscribe( ( { content, id, link, status, title } ) => {
		update( $editor => ( {
			...$editor,
			data: {
				id,
				link,
				status,
				content: content?.raw || '',
				title: title?.raw || '',
			},
			is_dirty: false,
		} ) );
	} );

	// Update editor's data when changes store value is updated.
	changes_store.subscribe( $changes =>
		update( ( { data, ...$document } ) => ( {
			...$document,
			data: { ...data, ...$changes },
		} ) ),
	);

	const prompt_if_dirty = event => {
		event.preventDefault();
		event.returnValue = 'ciao!';

		return 'ciao!';
	};

	let current_value: EditorStoreValue;

	editor.subscribe( $editor => {
		current_value = $editor;

		if ( $editor.is_dirty ) {
			window.addEventListener( 'beforeunload', prompt_if_dirty, { capture: true } );
		} else {
			window.removeEventListener( 'beforeunload', prompt_if_dirty, { capture: true } );
		}
	} );

	return {
		...editor,
		fetch: original_store.fetch,

		clear() {
			changes_store.delete();
		},

		async save() {
			try {
				const { data } = current_value;
				const { id: current_id } = data;

				update( $editor => ( { ...$editor, is_saving: true, was_saving: false } ) );

				await original_store.save( data );

				update( $editor => ( { ...$editor, is_saved: true, was_saving: true } ) );

				// We've just created a new post.
				if ( ! current_id && current_value.data.id ) {
					window.history.pushState( {}, '', edit_link_template.replace( '<id>', current_value.data.id.toString() ) );
				}
			} catch ( error ) {
				// TODO: Display error in notice section.
				// eslint-disable-next-line no-console
				console.error( error );
			} finally {
				update( $editor => ( { ...$editor, is_saving: false } ) );
			}
		},

		update( new_changes: Changes ) {
			changes_store.update( $changes => ( { ...$changes, ...new_changes } ) );
			update( $editor => ( {
				...$editor,
				is_dirty: true,
				is_saved: false,
				was_saving: false,
			} ) );
		},
	};
}