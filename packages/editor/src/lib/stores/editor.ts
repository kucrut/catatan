import { persist, localStorage } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import type { Changes, Config } from '$types';
import type { PostStore } from './post';

export interface EditorStoreValue {
	data: Changes;
	is_dirty: boolean;
	is_saved: boolean;
	is_saving: boolean;
	was_saving: boolean;
}

export interface EditorStoreParams extends Pick< Config, 'edit_link_template' | 'post_id' > {
	post_store: PostStore;
}

export default function create_editor_store( params: EditorStoreParams ) {
	const { edit_link_template, post_id, post_store } = params;

	const store = persist( writable< Changes >( null ), localStorage(), `catatan-document-${ post_id }` );

	const { update, ...editor } = writable< EditorStoreValue >( {
		data: null,
		is_dirty: false,
		is_saved: false,
		is_saving: false,
		was_saving: false,
	} );

	// Update editor's data when original store value is updated.
	post_store.subscribe( $original => {
		const { content, id, link, slug, status, title } = $original;

		update( $editor => ( {
			...$editor,
			data: {
				id,
				link,
				slug,
				status,
				content: content?.raw || '',
				title: title?.raw || '',
			},
			is_dirty: false,
		} ) );
	} );

	// Update editor's data when changes store value is updated.
	store.subscribe( $changes =>
		update( ( { data, ...$document } ) => ( {
			...$document,
			data: { ...data, ...$changes },
		} ) ),
	);

	const prompt_if_dirty = ( event: BeforeUnloadEvent ) => {
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

	window.addEventListener( 'unload', () => {
		store.delete();
	} );

	return {
		...editor,
		fetch: post_store.fetch,

		clear() {
			store.delete();
		},

		async save() {
			try {
				const { data } = current_value;
				const { id: current_id } = data;

				update( $editor => ( { ...$editor, is_saving: true, was_saving: false } ) );

				await post_store.save( data );

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
			store.update( $changes => ( { ...$changes, ...new_changes } ) );
			update( $editor => ( {
				...$editor,
				is_dirty: true,
				is_saved: false,
				was_saving: false,
			} ) );
		},
	};
}

export type EditorStore = ReturnType< typeof create_editor_store >;
