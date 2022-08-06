<script lang="ts">
	import { getContext } from 'svelte';
	import type { Config } from '$types';

	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );
</script>

<div class="edit-post-visual-editor__post-title-wrapper" contenteditable="false">
	<h1
		class="wp-block wp-block-post-title block-editor-block-list__block editor-post-title editor-post-title__input rich-text is-selected"
		aria-label={l10n.title_input_placeholder}
		role="textbox"
		aria-multiline="true"
		contenteditable="true"
	>
		<span data-rich-text-placeholder={l10n.title_input_placeholder} contenteditable="false" />
	</h1>
</div>

<style>
	div {
		padding: 0 60px;
	}

	span {
		pointer-events: none;
		user-select: none;
	}
</style>
