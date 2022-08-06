import { persist, localStorage } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import type { WP_REST_API_Post } from 'wp-types';

type Post = Partial< WP_REST_API_Post >;

export interface DocumentStoreValue {
	original: Post;
	changes: Post;
	is_dirty: boolean;
}

export type DocumentStore = ReturnType< typeof create_document_store >;

export default function create_document_store( post_id: number ) {
	const { update, ...store } = persist(
		writable< DocumentStoreValue >( {
			changes: {},
			is_dirty: false,
			original: {},
		} ),
		localStorage(),
		`catatan-document-${ post_id }`,
	);

	return {
		...store,

		clear_changes() {
			update( ( value: DocumentStoreValue ) => ( {
				...value,
				changes: {},
				is_dirty: false,
			} ) );
		},

		set_original( original: Post ) {
			update( ( value: DocumentStoreValue ) => ( {
				...value,
				original,
			} ) );
		},

		update( new_changes: Post ) {
			update( ( { changes, ...rest }: DocumentStoreValue ) => ( {
				...rest,
				changes: {
					...changes,
					...new_changes,
				},
				is_dirty: true,
			} ) );
		},
	};
}
