<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { getContext } from 'svelte';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );

	function handle_input( event: InputEvent & { currentTarget: HTMLInputElement } ) {
		editor.update( { title: event.currentTarget.value } );
	}
</script>

<div class="edit-post-visual-editor__post-title-wrapper">
	<label for="post-title" class="screen-reader-text">{__( 'Post Title' )}</label>
	<input
		class="wp-block wp-block-post-title block-editor-block-list__block editor-post-title editor-post-title__input"
		id="post-title"
		placeholder={__( 'Add title' )}
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
		font-weight: 300;
		/* stylelint-disable custom-property-pattern */
		font-family: var( --wp--preset--font-family--source-serif-pro );
		font-size: var( --wp--custom--typography--font-size--gigantic );
		line-height: var( --wp--custom--typography--line-height--tiny );
	}
</style>
