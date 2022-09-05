import type { ActionReturn } from 'svelte/action';

function get_focusable_elements( element: HTMLElement ): Element[] {
	return [
		...element.querySelectorAll( '[tabindex]:not([tabindex="-1"]), a[href], button, details, input, select, textarea' ),
	].filter(
		el => ! el.hasAttribute( 'disabled' ) && ! el.hasAttribute( 'hidden' ) && ! el.getAttribute( 'aria-hidden' ),
	);
}

export function trap_focus( node: HTMLElement ): ActionReturn< undefined > {
	function handle_keydown( event: KeyboardEvent ): void {
		if ( event.code !== 'Tab' ) {
			return;
		}

		const focusable_els = get_focusable_elements( node );
		const last_focusable_el = focusable_els[ focusable_els.length - 1 ];
		const active_el = node.ownerDocument.activeElement;
		let el_to_focus: HTMLAnchorElement;

		if ( event.shiftKey && active_el === focusable_els[ 0 ] ) {
			el_to_focus = last_focusable_el as HTMLAnchorElement;
		} else if ( active_el === last_focusable_el ) {
			el_to_focus = focusable_els[ 0 ] as HTMLAnchorElement;
		}

		if ( el_to_focus ) {
			event.preventDefault();
			el_to_focus.focus();
		}
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
