import type { Config } from '$types';
import type { WP_REST_API_Post } from 'wp-types';
import create_changes_store, { type Changes, type ChangesStore } from './changes';
import notices_store, { type Notice } from './notices';
import post_store from './post';
import post_type_store from './post-type';
import with_params, { type WithParams } from './with-params';
import { __, sprintf } from '@wordpress/i18n';
import { writable, type Readable } from 'svelte/store';

export interface Editor {
	data: Changes;
	is_dirty: boolean;
	is_saved: boolean;
	is_saving: boolean;
	was_saving: boolean;
}

export type Params = Pick< Config, 'edit_link_template' | 'post_id' | 'post_list_url' >;

export interface EditorStore< T > extends Readable< T >, Omit< WithParams< Params >, 'subscribe' > {
	clear(): void;
	fetch(): Promise< void >;
	save(): Promise< void >;
	trash(): Promise< void >;
	// eslint-disable-next-line no-unused-vars
	update( new_changes: Changes ): void;
}

function confirm_leave( event: BeforeUnloadEvent ) {
	event.preventDefault();
	event.returnValue = 'confirm leave';

	return 'confirm leave';
}

function toggle_beforeunload_listener( $editor: Editor ) {
	if ( $editor.is_dirty ) {
		window.addEventListener( 'beforeunload', confirm_leave, { capture: true } );
	} else {
		window.removeEventListener( 'beforeunload', confirm_leave, { capture: true } );
	}
}

/**
 * Create editor store
 *
 * @todo is_dirty: Compare changes and $saved_post, ensure content, excerpt and title are not empty.
 * @todo can_save: Ensure content, excerpt and title are not empty. Also check is_dirty.
 * @todo Handle (un)scheduling
 */
function create_store(): EditorStore< Editor > {
	const params = with_params< Params >();

	const { update, ...editor } = writable< Editor >( {
		data: {},
		is_dirty: false,
		is_saved: false,
		is_saving: false,
		was_saving: false,
	} );

	let changes: ChangesStore;
	let $saved_post: Partial< WP_REST_API_Post >;
	let $store: Editor;

	params.subscribe( $params => {
		if ( changes || ! $params ) {
			return;
		}

		const { post_id } = $params;

		if ( typeof post_id === 'undefined' ) {
			return;
		}

		changes = create_changes_store( post_id );

		// Update editor's data when changes store value is updated.
		changes.subscribe( $changes => {
			update( ( { data, ...$document } ) => ( {
				...$document,
				data: { ...data, ...$changes },
			} ) );
		} );
	} );

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

	editor.subscribe( toggle_beforeunload_listener );
	editor.subscribe( $editor => ( $store = $editor ) );

	return {
		...params,
		...editor,

		fetch: post_store.fetch,

		clear() {
			if ( changes ) {
				changes.delete();
			}
		},

		async save() {
			try {
				const { edit_link_template } = this.get_params();
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

				const { labels, viewable } = post_type_store.get();
				const { item_published, item_updated, singular_name, view_item } = labels;

				let notice_content: Notice[ 'content' ];
				let notice_link_text: Notice[ 'link' ][ 'text' ];

				if ( prev_status === 'draft' && status === 'publish' ) {
					notice_content = item_published;
					notice_link_text = view_item;
				} else if ( prev_status && prev_status !== 'draft' && status === 'draft' ) {
					notice_content = sprintf( __( '%s reverted to draft.' ), singular_name );
				} else if ( status === 'publish' ) {
					notice_content = item_updated;
					notice_link_text = view_item;
				} else {
					notice_content = __( 'Draft saved' );
					notice_link_text = __( 'View Preview' );
				}

				notices_store.add( {
					content: notice_content,
					id: 'saved',
					type: 'snack',
					link: viewable && notice_link_text ? { text: notice_link_text, url: link } : undefined,
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
			const { post_list_url } = this.get_params();

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
			if ( changes ) {
				changes.update( $changes => ( { ...$changes, ...new_changes } ) );
			}

			update( $editor => ( {
				...$editor,
				is_dirty: true,
				is_saved: false,
				was_saving: false,
			} ) );
		},
	};
}

export default create_store();
