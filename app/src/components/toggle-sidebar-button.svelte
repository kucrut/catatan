<script lang="ts">
	import Button from './button.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	const ui = get_store( 'ui' );

	function toggle(): void {
		ui.toggle_sidebar();
	}
</script>

<Button
	aria-expanded={$ui.is_sidebar_open}
	aria-label={__( 'Settings' )}
	aria-pressed={$ui.is_sidebar_open}
	class={$ui.is_sidebar_open ? 'is-pressed' : ''}
	icon="gear"
	on:click={toggle}
/>
