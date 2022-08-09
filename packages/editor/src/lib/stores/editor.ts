import { __, sprintf } from '@wordpress/i18n';
import { persist, localStorage } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import type { Changes, Config } from '$types';
import type { PostStore } from './post';
import type { Notice, NoticesStore } from './notices';
import type { PostTypeStore } from './post-type';
import type { WP_REST_API_Post, WP_REST_API_Type } from 'wp-types';

export interface EditorStoreValue {
	data: Changes;
	is_dirty: boolean;
	is_saved: boolean;
	is_saving: boolean;
	was_saving: boolean;
}

export interface EditorStoreParams extends Pick< Config, 'edit_link_template' | 'post_id' > {
	notices_store: NoticesStore;
	post_store: PostStore;
	post_type_store: PostTypeStore;
}

function prompt_if_dirty( event: BeforeUnloadEvent ) {
	event.preventDefault();
	event.returnValue = 'ciao!';

	return 'ciao!';
}

/**
 * Create editor store
 *
 * @todo is_dirty: Compare changes and saved_post, ensure content, excerpt and title are not empty.
 * @todo can_save: Ensure content, excerpt and title are not empty. Also check is_dirty.
 * @todo Handle (un)scheduling
 *
 * @param {EditorStoreParams} params Parameters.
 * @return {EditorStore} Editor store.
 */
export default function create_editor_store( params: EditorStoreParams ) {
	const { edit_link_template, notices_store, post_id, post_store, post_type_store } = params;

	const changes = persist( writable< Changes >( {} ), localStorage(), `catatan-document-${ post_id }` );

	const { update, ...editor } = writable< EditorStoreValue >( {
		data: {},
		is_dirty: false,
		is_saved: false,
		is_saving: false,
		was_saving: false,
	} );

	let saved_post: Partial< WP_REST_API_Post >;

	// Update editor's data when post store value is updated.
	post_store.subscribe( $original => {
		saved_post = $original;

		if ( ! $original ) {
			return;
		}

		const { content, excerpt, id, link, slug, status, title } = $original;

		update( $editor => ( {
			...$editor,
			data: {
				id,
				link,
				slug,
				status,
				content: content?.raw || '',
				excerpt: excerpt?.raw || '',
				title: title?.raw || '',
			},
			is_dirty: false,
		} ) );
	} );

	// Update editor's data when changes store value is updated.
	changes.subscribe( $changes => {
		update( ( { data, ...$document } ) => ( {
			...$document,
			data: { ...data, ...$changes },
		} ) );
	} );

	let current_value: EditorStoreValue;

	editor.subscribe( $editor => {
		current_value = $editor;

		if ( $editor.is_dirty ) {
			window.addEventListener( 'beforeunload', prompt_if_dirty, { capture: true } );
		} else {
			window.removeEventListener( 'beforeunload', prompt_if_dirty, { capture: true } );
		}
	} );

	let post_type: WP_REST_API_Type;

	post_type_store.subscribe( $type => ( post_type = $type ) );

	window.addEventListener( 'unload', () => {
		changes.delete();
	} );

	return {
		...editor,
		fetch: post_store.fetch,

		clear() {
			changes.delete();
		},

		async save() {
			try {
				const { id: prev_id, status: prev_status } = saved_post;
				const { data } = current_value;
				const { id, status } = data;

				update( $editor => ( { ...$editor, is_saving: true, was_saving: false } ) );

				await post_store.save( data );

				update( $editor => ( { ...$editor, is_saved: true, was_saving: true } ) );

				// We've just created a new post.
				if ( ! prev_id && data.id ) {
					window.history.pushState( {}, '', edit_link_template.replace( '<id>', id.toString() ) );
				}

				let notice_content: Notice[ 'content' ];
				let notice_link_text: Notice[ 'link' ][ 'text' ];

				if ( prev_status === 'draft' && status === 'publish' ) {
					notice_content = post_type.labels.item_published;
					notice_link_text = post_type.labels.view_item;
				} else if ( prev_status !== 'draft' && status === 'draft' ) {
					notice_content = sprintf( __( '%s reverted to draft.' ), post_type.labels.singular_name );
				} else if ( data.status === 'publish' ) {
					notice_content = post_type.labels.item_updated;
					notice_link_text = post_type.labels.view_item;
				} else {
					notice_content = __( 'Draft saved' );
					notice_link_text = __( 'View Preview' );
				}

				notices_store.add( {
					content: notice_content,
					id: 'saved',
					type: 'snack',
					link: notice_link_text ? { text: notice_link_text, url: data.link } : undefined,
				} );
			} catch ( error ) {
				notices_store.add( {
					content: error.message,
					dismissible: true,
					id: 'save-error',
					type: 'error',
				} );
			} finally {
				update( $editor => ( { ...$editor, is_saving: false } ) );
			}
		},

		/**
		 * Update changes
		 *
		 * This method overrides the original 'update' method because we only want to allow consumers
		 * to update the data property (changes store). Other properties are for internal use only.
		 *
		 * @param {Changes} new_changes Changes made to the post.
		 */
		update( new_changes: Changes ) {
			changes.update( $changes => ( { ...$changes, ...new_changes } ) );

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
