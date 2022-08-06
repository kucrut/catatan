<script lang="ts">
	import { getContext } from 'svelte';
	// import type { Config } from '$types';
	import type { DocumentStore } from '$lib/stores/document';

	const doc = getContext< DocumentStore >( 'document' );
	// const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	function handle_change( event: Event & { currentTarget: HTMLTextAreaElement } ) {
		doc.update( { content: event.currentTarget.value } );
	}
</script>

<div class="is-root-container block-editor-block-list__layout">
	<textarea class="widefat" on:change={handle_change}>{$doc.data.content}</textarea>
</div>

<style>
	textarea {
		display: block;
		min-height: 10rem;
		font-size: 1em;
	}
</style>
