<script lang="ts">
	import { click_outside } from '$actions/click-outside';
	import { onMount, createEventDispatcher } from 'svelte';
	import { handle_escape } from '$actions/handle-escape';
	import { trap_focus } from '$actions/trap-focus';

	export let is_anchored = false;
	export let open = true;

	const dispatch = createEventDispatcher< { close: undefined; escape: undefined } >();
	let el: HTMLDialogElement;

	onMount( () => {
		if ( is_anchored ) {
			const { left, top } = el.ownerDocument.activeElement.getBoundingClientRect();

			el.style.left = `${ left }px`;
			el.style.top = `calc( ${ top }px + 1.75rem )`;
		}
	} );
</script>

<dialog
	{open}
	tabindex="-1"
	bind:this={el}
	class:is-anchored={is_anchored}
	use:click_outside={{ active: true, callback: () => dispatch( 'close' ) }}
	use:handle_escape={{ callback: () => dispatch( 'escape' ) }}
	use:trap_focus
>
	<div class="components-popover__content">
		<slot />
	</div>
</dialog>

<style>
	dialog {
		z-index: 10000;
		margin-block-start: 1rem;
		padding: unset;
		border: unset;
	}

	.is-anchored {
		position: fixed;
		margin-block: 1rem unset;
		margin-inline: unset;
	}
</style>
