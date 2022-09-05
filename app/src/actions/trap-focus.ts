import type { ActionReturn } from 'svelte/action';

export function trap_focus( node: HTMLElement ): ActionReturn< undefined > {
	const focusable_els = node.querySelectorAll(
		'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])',
	);
	const last_focusable_el = focusable_els[ focusable_els.length - 1 ];

	function handle_keydown( event: KeyboardEvent ): void {
		if ( event.code !== 'Tab' ) {
			return;
		}

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
