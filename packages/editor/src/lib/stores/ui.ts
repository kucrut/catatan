// TODO: Integrate with localstorage

import { writable } from 'svelte/store';
import type { UiState } from '$types';

function create_store() {
	const store = writable< UiState >( {
		is_sidebar_open: false,
	} );

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
