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
	is_saved: boolean;
}

export type DocumentStore = ReturnType< typeof create_document_store >;

export type DocumentStoreParams = Pick< Config, 'post_id' | 'post_type' | 'rest_path' >;

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

export default function create_document_store( { post_id, rest_path }: DocumentStoreParams ) {
	const original = create_original_post_store( post_id, rest_path );

	const { update, ...store } = persist(
		writable< DocumentStoreValue >( {
			data: {},
			is_dirty: false,
			is_saved: false,
		} ),
		localStorage(),
		`catatan-document-${ post_id }`,
	);

	original.subscribe( ( { content, status, title } ) => {
		update( value => ( {
			...value,
			data: {
				status,
				content: content?.raw || '',
				title: title?.raw || '',
			},
			is_dirty: false,
		} ) );
	} );

	let current_value: DocumentStoreValue;

	store.subscribe( value => ( current_value = value ) );

	return {
		...store,
		fetch: original.fetch,

		async save() {
			try {
				await original.save( current_value.data );
				update( value => ( { ...value, is_saved: true } ) );
			} catch ( error ) {
				// TODO: Display error in notice section.
				// eslint-disable-next-line no-console
				console.error( error );
			}
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
