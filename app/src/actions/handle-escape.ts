import type { ActionReturn } from 'svelte/action';

interface Params {
	callback: () => void;
}

export function handle_escape( node: HTMLElement, params: Params ): ActionReturn< Params > {
	let current_callback: Params[ 'callback' ];

	const handle_keydown = ( event: KeyboardEvent ): void => {
		if ( event.code === 'Escape' ) {
			current_callback();
		}
	};

	const toggle = ( active: boolean, current_params: Params ): void => {
		if ( active ) {
			current_callback = current_params.callback;
			node.addEventListener( 'keydown', handle_keydown, true );
		} else {
			node.removeEventListener( 'keydown', handle_keydown, true );
		}
	};

	const destroy = (): void => toggle( false, { callback: current_callback } );

	toggle( true, params );

	return {
		destroy,
		update( next_params: Params ): void {
			destroy();
			toggle( true, next_params );
		},
	};
}
