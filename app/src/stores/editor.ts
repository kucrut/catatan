import type { Config } from '$types';
import type { Editor as TipTapEditor } from '@tiptap/core';
import type { WP_REST_API_Post, WP_REST_API_Type } from 'wp-types';
import type { Notice, NoticesStore } from './notices';
import type { PostStore } from './post';
import type { PostTypeStore } from './post-type';
import create_changes_store, { type Changes } from './changes';
import omit from 'just-omit';
import { __, sprintf } from '@wordpress/i18n';
import { writable, type Readable } from 'svelte/store';

export interface Options extends Pick< Config, 'edit_link' | 'post_id' | 'post_list_url' > {
	notices: NoticesStore;
	post: PostStore;
	post_type: PostTypeStore;
}

export interface Editor {
	can_save: boolean;
	data: Changes;
	is_dirty: boolean;
	is_saved: boolean;
	is_saving: boolean;
	editor?: TipTapEditor;
	was_saving: boolean;
}

export interface EditorStore extends Readable< Editor > {
	add_term( taxonomy: string, term_id: number ): void;
	remove_term( taxonomy: string, term_id: number ): void;
	clear(): void;
	fetch(): Promise< void >;
	save(): Promise< void >;
	trash(): Promise< void >;
	update( new_changes: Changes ): void;
}

function confirm_leave( event: BeforeUnloadEvent ): string {
	event.preventDefault();
	event.returnValue = 'confirm leave';

	return 'confirm leave';
}

function toggle_beforeunload_listener( $editor: Editor ): void {
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
 * @todo Handle (un)scheduling
 *
 * @param {Options} options Options.
 */
export default function create_store( options: Options ): EditorStore {
	const { edit_link, notices, post, post_id, post_list_url, post_type } = options;

	let $post_type: WP_REST_API_Type;
	let $saved_post: Partial< WP_REST_API_Post >;
	let $store: Editor;

	const { update, ...editor } = writable< Editor >( {
		data: {},
		can_save: false,
		is_dirty: false,
		is_saved: false,
		is_saving: false,
		was_saving: false,
	} );

	const changes = create_changes_store( post_id );

	// Update editor's data when post store value is updated.
	post.subscribe( $post => {
		$saved_post = $post;

		if ( ! $post ) {
			return;
		}

		const { content, excerpt, status, title, ...rest } = $post;
		// auto-draft posts have default title that we don't want to use.
		const proper_title = status === 'auto-draft' ? '' : title?.raw || '';

		update( $editor => ( {
			...$editor,
			data: {
				...omit( rest, [ 'generated_slug', 'permalink_template', 'guid', '_links' ] ),
				status,
				content: content?.raw || '',
				excerpt: excerpt?.raw || '',
				title: proper_title,
			},
			is_dirty: false,
		} ) );
	} );

	// Update editor's data when changes store value is updated.
	changes.subscribe( $changes => {
		update( ( { data, ...$editor } ) => {
			const { content: new_content, excerpt: new_excerpt, title: new_title } = $changes;
			const { content, excerpt, status, title } = data;

			return {
				...$editor,
				can_save:
					// Saving an auto-draft post needs content or excerpt or title to be set.
					status === 'auto-draft'
						? Boolean( content || new_content || excerpt || new_excerpt || title || new_title )
						: Object.keys( $changes ).length > 0,
				data: { ...data, ...$changes },
			};
		} );
	} );

	editor.subscribe( toggle_beforeunload_listener );
	editor.subscribe( $value => ( $store = $value ) );
	post_type.subscribe( $value => ( $post_type = $value ) );

	return {
		...editor,

		fetch: post.fetch,

		add_term( taxonomy: string, term_id: number ): void {
			if ( ! ( taxonomy in $store.data ) ) {
				return;
			}

			const next_terms = [ ...( $store.data[ taxonomy ] as number[] ), term_id ];

			this.update( { [ taxonomy ]: next_terms } );
		},

		remove_term( taxonomy: string, term_id: number ): void {
			if ( ! ( taxonomy in $store.data ) ) {
				return;
			}

			const current_terms = $store.data[ taxonomy ] as number[];
			const next_terms = current_terms.filter( id => term_id !== id );

			this.update( { [ taxonomy ]: next_terms } );
		},

		clear(): void {
			changes.delete();
		},

		async save(): Promise< void > {
			if ( ! $store.can_save ) {
				return;
			}

			try {
				const { data } = $store;
				const { status: next_status } = data;
				const { status: prev_status } = $saved_post;
				const was_auto_draft = prev_status === 'auto-draft';

				update( $editor => ( { ...$editor, is_saving: true, was_saving: false } ) );

				await post.save( {
					...data,
					status: was_auto_draft && next_status === 'auto-draft' ? 'draft' : next_status,
				} );

				const { data: new_data } = $store;
				const { link, status } = new_data;

				update( $editor => ( { ...$editor, is_saved: true, was_saving: true } ) );

				if ( was_auto_draft ) {
					window.history.pushState( {}, '', edit_link );
				}

				const { labels, viewable } = $post_type;
				const { item_published, item_updated, singular_name, view_item } = labels;

				let notice_content: Notice[ 'content' ];
				let notice_link_text: Notice[ 'link' ][ 'text' ];

				// TODO: Add more status checks.
				switch ( status ) {
					case 'publish':
						if ( was_auto_draft || prev_status === 'draft' ) {
							notice_content = item_published;
							notice_link_text = view_item;
						} else {
							notice_content = item_updated;
							notice_link_text = view_item;
						}
						break;

					default:
						if ( was_auto_draft || status === 'draft' ) {
							// TODO: Check these texts in the block editor source.
							notice_content = __( 'Draft saved.' );
							notice_link_text = __( 'View Preview' );
						} else {
							notice_content = sprintf( __( '%s reverted to draft.' ), singular_name );
						}
						break;
				}

				// TODO: Remove existing notice first in case it exists.

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

		async trash(): Promise< void > {
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
		update( new_changes: Changes ): void {
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
