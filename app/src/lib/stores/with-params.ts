import { writable } from 'svelte/store';

export type WithParams< P > = {
	get_params: () => P;
	// eslint-disable-next-line no-unused-vars
	set_params: ( params: P ) => void;
};

export default function with_params< P >(): WithParams< P > {
	const params_store = writable< P >();
	let $params: P;

	params_store.subscribe( $value => ( $params = $value ) );

	return {
		get_params() {
			return $params;
		},

		set_params( arg: P ) {
			params_store.update( () => arg );
		},
	};
}
