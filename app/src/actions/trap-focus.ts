import type { ActionReturn } from 'svelte/action';

export function trap_focus( node: HTMLElement ): ActionReturn< undefined > {
	/**
	 * Handle keydown event
	 *
	 * @param {KeyboardEvent} event Event.
	 */
	function handle_keydown( event: KeyboardEvent ): void {
		if ( event.code !== 'Tab' ) {
			return;
		}

		event.preventDefault();

		const tabbables = Array.from( node.querySelectorAll( '*' ) ).filter( el => {
			return (
				el instanceof HTMLElement &&
				'tabIndex' in el &&
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
		let index = node.ownerDocument.activeElement ? tabbables.indexOf( node.ownerDocument.activeElement ) : -1;

		if ( event.shiftKey ) {
			index = index > 0 ? index - 1 : tabbables.length - 1;
		} else {
			index = index + 1 < tabbables.length ? index + 1 : 0;
		}

		const focused_el = tabbables[ index ];

		if ( focused_el instanceof HTMLElement ) {
			focused_el.focus();
		}
	}

	/**
	 * Toggle keydown event listener
	 *
	 * @param {boolean} should_listen State.
	 */
	function toggle_listener( should_listen: boolean ): void {
		if ( should_listen ) {
			window.addEventListener( 'keydown', handle_keydown );
		} else {
			window.removeEventListener( 'keydown', handle_keydown );
		}
	}

	toggle_listener( true );
	node.focus();

	return {
		destroy(): void {
			toggle_listener( false );
		},
	};
}
