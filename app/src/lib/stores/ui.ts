import { createLocalStorage, persist, type PersistentStore } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export interface Ui {
	is_sidebar_open: boolean;
}

export interface UiStore extends PersistentStore< Ui > {
	close_sidebar(): void;
	toggle_sidebar(): void;
}

function create_ui_store(): UiStore {
	const { update, ...store } = persist(
		writable< Ui >( {
			is_sidebar_open: false,
		} ),
		createLocalStorage(),
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
