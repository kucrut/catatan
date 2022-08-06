import { persist, localStorage } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import type { UiState } from '$types';

function create_store() {
	const store = persist(
		writable< UiState >( {
			is_sidebar_open: false,
		} ),
		localStorage(),
		'catatan-ui',
	);

	return {
		...store,
		close_sidebar() {
			this.update( value => ( {
				...value,
				is_sidebar_open: false,
			} ) );
		},

		toggle_sidebar() {
			this.update( value => ( {
				...value,
				is_sidebar_open: ! value.is_sidebar_open,
			} ) );
		},
	};
}

export default create_store();
