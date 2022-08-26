<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import Button from './button.svelte';
	import notices, { type Notice } from '$lib/stores/notices';

	export let item: Notice;

	const { content, dismissible, id, type } = item;
</script>

<div class="components-notice" class:is-dismissible={dismissible} class:is-error={type === 'error'}>
	<div class="components-notice__content">
		{content}
		<div class="components-notice__actions" />
	</div>
	{#if dismissible}
		<Button
			aria-label={__( 'Dismiss this notice', 'catatan' )}
			class="components-notice__dismiss"
			icon="close"
			on:click={() => notices.remove( id )}
		/>
	{/if}
</div>
