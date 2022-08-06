<script lang="ts">
	import { getContext } from 'svelte';
	import type { Config } from '$types';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	function handle_input( event: Event & { currentTarget: HTMLInputElement } ) {
		editor.update( { title: event.currentTarget.value } );
	}
</script>

<div class="edit-post-visual-editor__post-title-wrapper">
	<label for="post-title" class="screen-reader-text">{l10n.post_title}</label>
	<input
		class="wp-block wp-block-post-title block-editor-block-list__block editor-post-title editor-post-title__input"
		id="post-title"
		placeholder={l10n.title_input_placeholder}
		value={$editor.data.title}
		on:input={handle_input}
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
