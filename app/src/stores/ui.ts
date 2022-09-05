import { createLocalStorage, persist, type PersistentStore } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export interface Ui {
	is_sidebar_open: boolean;
	open_panels: string[];
}

type ToggleType = 'sidebar';

export interface UiStore extends PersistentStore< Ui > {
	toggle( type: ToggleType ): void;
}

export default function create_store(): UiStore {
	const { update, ...store } = persist(
		writable< Ui >( {
			is_sidebar_open: false,
			open_panels: [],
		} ),
		createLocalStorage(),
		'catatan-ui',
	);

	return {
		...store,
		update,

		toggle( type: ToggleType ): void {
			const key = `is_${ type }_open`;

			update( $value => ( {
				...$value,
				[ key ]: ! $value[ key ],
			} ) );
		},
	};
}
