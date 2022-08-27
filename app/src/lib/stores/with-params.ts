import { writable, type Readable, type Writable } from 'svelte/store';

export type WithParams< P > = ( Readable< P > | Writable< P > ) & {
	get_params: () => P;
	// eslint-disable-next-line no-unused-vars
	set_params: ( params: P ) => void;
};

export default function with_params< P >(): WithParams< P > {
	const { subscribe, update } = writable< P >();
	let $params: P;

	subscribe( $value => ( $params = $value ) );

	return {
		subscribe,

		get_params() {
			return $params;
		},

		set_params( arg: P ) {
			update( current => ( {
				...current,
				...arg,
			} ) );
		},
	};
}
