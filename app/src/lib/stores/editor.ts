import type { Config } from '$types';
import type { WP_REST_API_Post } from 'wp-types';
import type { Notice, NoticesStore } from './notices';
import type { PostStore } from './post';
import type { PostTypeStore } from './post-type';
import create_changes_store, { type Changes } from './changes';
import { __, sprintf } from '@wordpress/i18n';
import { writable, type Readable } from 'svelte/store';

export interface Editor {
	data: Changes;
	is_dirty: boolean;
	is_saved: boolean;
	is_saving: boolean;
	was_saving: boolean;
}

export interface Options extends Pick< Config, 'edit_link_template' | 'post_id' | 'post_list_url' > {
	notices: NoticesStore;
	post: PostStore;
	post_type: PostTypeStore;
}

export interface EditorStore extends Readable< Editor > {
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
 *
 * @param {Options} options Options.
 */
export default function create_store( options: Options ): EditorStore {
	const { edit_link_template, notices, post, post_id, post_list_url, post_type } = options;

	const { update, ...editor } = writable< Editor >( {
		data: {},
		is_dirty: false,
		is_saved: false,
		is_saving: false,
		was_saving: false,
	} );

	const changes = create_changes_store( post_id );

	let $saved_post: Partial< WP_REST_API_Post >;
	let $store: Editor;

	// Update editor's data when post store value is updated.
	post.subscribe( $post => {
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

	return {
		...editor,

		fetch: post.fetch,

		clear() {
			if ( changes ) {
				changes.delete();
			}
		},

		async save() {
			try {
				const { id: prev_id, status: prev_status } = $saved_post;
				update( $editor => ( { ...$editor, is_saving: true, was_saving: false } ) );

				await post.save( $store.data );

				const { data } = $store;
				const { id, link, status } = data;

				update( $editor => ( { ...$editor, is_saved: true, was_saving: true } ) );

				// We've just created a new post.
				if ( ! prev_id && id ) {
					window.history.pushState( {}, '', edit_link_template.replace( '<id>', id.toString() ) );
				}

				const { labels, viewable } = post_type.get();
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

				notices.add( {
					content: notice_content,
					id: 'saved',
					type: 'snack',
					link: viewable && notice_link_text ? { text: notice_link_text, url: link } : undefined,
				} );
			} catch ( error ) {
				notices.add( {
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
			try {
				await post.trash();

				window.location.href = post_list_url;
			} catch ( error ) {
				notices.add( {
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
