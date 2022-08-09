<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import type { Config } from '$types';
	import type { Notice, NoticesStore } from '$lib/stores/notices';

	export let item: Notice;

	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );
	const notices = getContext< NoticesStore >( 'notices' );

	const { content, dismissible, id, type } = item;
</script>

<div class="components-notice  " class:is-dismissible={dismissible} class:is-error={type === 'error'}>
	<div class="components-notice__content">
		{content}
		<div class="components-notice__actions" />
	</div>
	{#if dismissible}
		<Button
			aria-label={l10n.dismiss_this_notice}
			class="components-notice__dismiss"
			icon="close"
			on:click={() => notices.remove( id )}
		/>
	{/if}
</div>
