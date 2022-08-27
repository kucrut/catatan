import type { Readable, Writable } from 'svelte/store';

export type WithGet< T > = ( Readable< T > | Writable< T > ) & {
	get(): T;
};

export default function with_get< T >( store: Readable< T > | Writable< T > ): WithGet< T > {
	let $store: T;

	store.subscribe( $value => ( $store = $value ) );

	return {
		...store,

		get() {
			return $store;
		},
	};
}
