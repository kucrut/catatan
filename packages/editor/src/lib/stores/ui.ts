import { persist, localStorage } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export interface UiState {
	is_sidebar_open: boolean;
}

function create_ui_store() {
	const { update, ...store } = persist(
		writable< UiState >( {
			is_sidebar_open: false,
		} ),
		localStorage(),
		'catatan-ui',
	);

	return {
		...store,
		update,
		close_sidebar() {
			update( value => ( {
				...value,
				is_sidebar_open: false,
			} ) );
		},

		toggle_sidebar() {
			update( value => ( {
				...value,
				is_sidebar_open: ! value.is_sidebar_open,
			} ) );
		},
	};
}

export default create_ui_store();
