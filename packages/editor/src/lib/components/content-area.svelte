<script lang="ts">
	import ContentInput from './content-input.svelte';
	import TitleInput from './title-input.svelte';
</script>

<div class="edit-post-visual-editor__content-area">
	<div class="is-desktop-preview">
		<div class="editor-styles-wrapper block-editor-writing-flow">
			<TitleInput />
			<ContentInput />
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
		align-items: center;
		padding-inline-start: 1rem;
		padding-inline-end: 1rem;
		background: #fff none repeat scroll 0% 0%;
	}

	.editor-styles-wrapper {
		max-width: 920px;
		flex: 1 1 0%;
	}
</style>
