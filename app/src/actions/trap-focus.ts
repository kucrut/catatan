import type { ActionReturn } from 'svelte/action';

export function trap_focus( node: HTMLElement ): ActionReturn< undefined > {
	function handle_keydown( event: KeyboardEvent ): void {
		if ( event.code !== 'Tab' ) {
			return;
		}

		event.preventDefault();

		const tabbables = Array.from( node.querySelectorAll( '*' ) ).filter( el => {
			return (
				'tabIndex' in el &&
				// @ts-expect-error The element must have tabIndex attribute after the check above.
				el.tabIndex >= 0 &&
				! el.hasAttribute( 'disabled' ) &&
				! el.hasAttribute( 'hidden' ) &&
				! el.getAttribute( 'aria-hidden' )
			);
		} );

		if ( ! tabbables.length ) {
			return;
		}

		// Index of element that's currently in focus.
		let index = tabbables.indexOf( node.ownerDocument.activeElement );

		// The focus is outside. Reset it.
		if ( index === -1 ) {
			index = 0;
		}

		index += tabbables.length + ( event.shiftKey ? -1 : 1 );
		index %= tabbables.length;

		// @ts-expect-error This is fine.
		tabbables[ index ].focus();
	}

	function toggle_listener( should_listen: boolean ): void {
		if ( should_listen ) {
			node.addEventListener( 'keydown', handle_keydown );
		} else {
			node.removeEventListener( 'keydown', handle_keydown );
		}
	}

	toggle_listener( true );

	return {
		destroy(): void {
			toggle_listener( false );
		},
	};
}
