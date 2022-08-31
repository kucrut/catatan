import type { ActionReturn } from 'svelte/action';

interface Params {
	active: boolean;
	callback: () => void;
}

export function click_outside( node: HTMLElement, params: Params ): ActionReturn< Params > {
	let current_callback: Params[ 'callback' ];

	const handle_click = ( event: MouseEvent & { target: HTMLElement } ): void => {
		if ( ! node.contains( event.target ) ) {
			current_callback();
		}
	};

	const toggle = ( current_params: Params ): void => {
		const { active, callback } = current_params;

		if ( active ) {
			current_callback = callback;
			document.addEventListener( 'click', handle_click, true );
		} else {
			document.removeEventListener( 'click', handle_click, true );
		}
	};

	toggle( params );

	return {
		update( next_params: Params ): void {
			toggle( next_params );
		},
		destroy(): void {
			toggle( { active: false, callback: current_callback } );
		},
	};
}
