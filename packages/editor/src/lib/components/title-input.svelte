<script lang="ts">
	import { getContext } from 'svelte';
	import type { Config } from '$types';

	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );
</script>

<div class="edit-post-visual-editor__post-title-wrapper">
	<input
		class="wp-block wp-block-post-title block-editor-block-list__block editor-post-title editor-post-title__input"
		placeholder={l10n.title_input_placeholder}
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
