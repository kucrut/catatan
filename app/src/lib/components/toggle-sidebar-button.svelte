<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import Button from './button.svelte';
	import ui from '$lib/stores/ui';
</script>

<Button
	aria-expanded={$ui.is_sidebar_open}
	aria-label={__( 'Settings' )}
	aria-pressed={$ui.is_sidebar_open}
	class={$ui.is_sidebar_open ? 'is-pressed' : ''}
	icon="gear"
	on:click={() => ui.toggle_sidebar()}
/>
