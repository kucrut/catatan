<script lang="ts">
	import { click_outside } from '$actions/click-outside';
	import { createEventDispatcher } from 'svelte';
	import { handle_escape } from '$actions/handle-escape';
	import { trap_focus } from '$actions/trap-focus';

	export let autofocus = true;

	const dispatch = createEventDispatcher< { close: undefined; escape: undefined } >();
	const class_prefix = 'components-popover';
</script>

<!-- svelte-ignore a11y-autofocus -->
<dialog
	{autofocus}
	open
	tabindex="-1"
	use:click_outside={{ active: true, callback: () => dispatch( 'close' ) }}
	use:handle_escape={{ callback: () => dispatch( 'escape' ) }}
	use:trap_focus
>
	<div class="{class_prefix}__content">
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
</style>
