import { __, sprintf } from '@wordpress/i18n';
import { writable } from 'svelte/store';
import create_changes_store, { type Changes } from './changes';
import type { Config } from '$types';
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

export interface EditorStoreParams extends Pick< Config, 'edit_link_template' | 'post_id' | 'post_list_url' > {
	notices_store: NoticesStore;
	post_store: PostStore;
	post_type_store: PostTypeStore;
}

function prompt_if_dirty( event: BeforeUnloadEvent ) {
	event.preventDefault();
	event.returnValue = 'ciao!';

	return 'ciao!';
}

function toggle_beforeunload_listener( $editor: EditorStoreValue ) {
	if ( $editor.is_dirty ) {
		window.addEventListener( 'beforeunload', prompt_if_dirty, { capture: true } );
	} else {
		window.removeEventListener( 'beforeunload', prompt_if_dirty, { capture: true } );
	}
}

/**
 * Create editor store
 *
 * @todo is_dirty: Compare changes and $saved_post, ensure content, excerpt and title are not empty.
 * @todo can_save: Ensure content, excerpt and title are not empty. Also check is_dirty.
 * @todo Handle (un)scheduling
 *
 * @param {EditorStoreParams} params Parameters.
 * @return {EditorStore} Editor store.
 */
export default function create_editor_store( params: EditorStoreParams ) {
	const { edit_link_template, notices_store, post_id, post_list_url, post_store, post_type_store } = params;

	const changes = create_changes_store( post_id );

	const { update, ...editor } = writable< EditorStoreValue >( {
		data: {},
		is_dirty: false,
		is_saved: false,
		is_saving: false,
		was_saving: false,
	} );

	let $post_type: WP_REST_API_Type;
	let $saved_post: Partial< WP_REST_API_Post >;
	let $store: EditorStoreValue;

	// Update editor's data when post store value is updated.
	post_store.subscribe( $post => {
		$saved_post = $post;

		if ( ! $post ) {
			return;
		}

		const { content, excerpt, id, link, slug, status, title } = $post;

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

	editor.subscribe( toggle_beforeunload_listener );
	editor.subscribe( $editor => ( $store = $editor ) );
	post_type_store.subscribe( $type => ( $post_type = $type ) );

	return {
		...editor,
		fetch: post_store.fetch,
		user_can: post_store.user_can,

		clear() {
			changes.delete();
		},

		async save() {
			try {
				const { id: prev_id, status: prev_status } = $saved_post;
				update( $editor => ( { ...$editor, is_saving: true, was_saving: false } ) );

				await post_store.save( $store.data );

				const { data } = $store;
				const { id, link, status } = data;

				update( $editor => ( { ...$editor, is_saved: true, was_saving: true } ) );

				// We've just created a new post.
				if ( ! prev_id && id ) {
					window.history.pushState( {}, '', edit_link_template.replace( '<id>', id.toString() ) );
				}

				let notice_content: Notice[ 'content' ];
				let notice_link_text: Notice[ 'link' ][ 'text' ];

				if ( prev_status === 'draft' && status === 'publish' ) {
					notice_content = $post_type.labels.item_published;
					notice_link_text = $post_type.labels.view_item;
				} else if ( prev_status !== 'draft' && status === 'draft' ) {
					notice_content = sprintf( __( '%s reverted to draft.' ), $post_type.labels.singular_name );
				} else if ( status === 'publish' ) {
					notice_content = $post_type.labels.item_updated;
					notice_link_text = $post_type.labels.view_item;
				} else {
					notice_content = __( 'Draft saved' );
					notice_link_text = __( 'View Preview' );
				}

				notices_store.add( {
					content: notice_content,
					id: 'saved',
					type: 'snack',
					link: $post_type.viewable && notice_link_text ? { text: notice_link_text, url: link } : undefined,
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

		async trash() {
			if ( ! post_store.user_can( 'delete' ) ) {
				return;
			}

			try {
				await post_store.trash();

				window.location.href = post_list_url;
			} catch ( error ) {
				notices_store.add( {
					content: error.message,
					dismissible: true,
					id: 'trash-error',
					type: 'error',
				} );
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
