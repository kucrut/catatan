<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { onMount } from 'svelte';
	import Button from './button.svelte';
	import notices, { type Notice } from '$lib/stores/notices';

	export let item: Notice;

	const { content, id, link } = item;
	let timeout_id: number;

	function cancel_scheduled_removal() {
		if ( timeout_id ) {
			clearTimeout( timeout_id );
		}
	}

	function schedule_removal() {
		cancel_scheduled_removal();
		timeout_id = setTimeout( () => {
			notices.remove( id );
		}, 3333 );
	}

	onMount( schedule_removal );
</script>

<div
	aria-label={__( 'Dismiss this notice' )}
	class="components-snackbar"
	role="button"
	tabindex="0"
	on:mouseenter={() => cancel_scheduled_removal()}
	on:mouseleave={() => schedule_removal()}
>
	<div class="components-snackbar__content">
		{content}
		{#if link}
			<Button is_tertiary class="components-snackbar__action" href={link.url} target="_blank">{link.text}</Button>
		{/if}
	</div>
</div>
