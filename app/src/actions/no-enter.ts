import type { ActionReturn } from 'svelte/action';

export function no_enter( node: HTMLElement ): ActionReturn {
	const handle_keydown = ( event: KeyboardEvent & { target: HTMLElement } ): void => {
		if ( event.code === 'Enter' ) {
			event.preventDefault();
		}
	};

	node.addEventListener( 'keydown', handle_keydown );

	return {
		destroy(): void {
			node.removeEventListener( 'keydown', handle_keydown );
		},
	};
}
