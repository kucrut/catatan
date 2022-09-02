<script lang="ts">
	import TitleInput from './title-input.svelte';
	import Lazy from './lazy.svelte';

	export let with_editor: boolean;
	export let with_title: boolean;
</script>

<div class="edit-post-visual-editor__content-area">
	<div class="is-desktop-preview">
		<div class="editor-styles-wrapper block-editor-writing-flow">
			{#if with_title}
				<TitleInput />
			{/if}
			{#if with_editor}
				<Lazy component={() => import( './editor/editor.svelte' )} />
			{/if}
		</div>
	</div>
</div>

<style>
	/* TODO: Make this toggleable via the "Preview" button. */
	.is-desktop-preview {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		margin: 0;
		display: flex;
		flex-flow: column nowrap;
	}

	.editor-styles-wrapper {
		flex: 1 1 0%;
		max-width: 100%;
		padding-block-end: 40vh;
		display: grid;
		grid-template-rows: auto 1fr;
	}
</style>
