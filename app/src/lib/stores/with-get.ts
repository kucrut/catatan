import type { Readable } from 'svelte/store';

export interface WithGet< T > extends Readable< T > {
	get(): T;
}

export default function with_get< T >( store: Readable< T > ): WithGet< T > {
	let $store: T;

	store.subscribe( $value => ( $store = $value ) );

	return {
		...store,

		get() {
			return $store;
		},
	};
}
