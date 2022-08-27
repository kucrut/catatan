<script lang="ts">
	import type { Notice } from '$stores/notices';
	import Button from './button.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	export let item: Notice;

	const notices = get_store( 'notices' );
	const { content, dismissible, id, type } = item;

	function remove(): void {
		notices.remove( id );
	}
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
			on:click={remove}
		/>
	{/if}
</div>
