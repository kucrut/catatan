<script lang="ts">
	import { getContext } from 'svelte';
	import type { Config } from '$types';
	import type { DocumentStore } from '$lib/stores/document';

	const doc = getContext< DocumentStore >( 'document' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	function handle_change( event: Event & { currentTarget: HTMLInputElement } ) {
		doc.update( { title: event.currentTarget.value } );
	}
</script>

<div class="edit-post-visual-editor__post-title-wrapper">
	<label for="post-title" class="screen-reader-text">{l10n.post_title}</label>
	<input
		class="wp-block wp-block-post-title block-editor-block-list__block editor-post-title editor-post-title__input"
		id="post-title"
		placeholder={l10n.title_input_placeholder}
		value={$doc.changes.title || $doc.original?.title?.raw || ''}
		on:change={handle_change}
	/>
</div>

<style>
	.edit-post-visual-editor__post-title-wrapper {
		margin-block-start: 2rem;
		margin-block-end: 0.5rem;
	}

	input {
		border: unset;
		font-family: var( --wp--preset--font-family--source-serif-pro );
		font-size: var( --wp--custom--typography--font-size--gigantic );
		font-weight: 300;
		line-height: var( --wp--custom--typography--line-height--tiny );
	}
</style>
