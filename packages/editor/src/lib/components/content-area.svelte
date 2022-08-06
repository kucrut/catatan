<script lang="ts">
	import Editor from './editor.svelte';
	import TitleInput from './title-input.svelte';
</script>

<div class="edit-post-visual-editor__content-area">
	<div class="is-desktop-preview">
		<div class="editor-styles-wrapper block-editor-writing-flow">
			<TitleInput />
			<Editor />
		</div>
	</div>
</div>

<style>
	/* TODO: Make this toggleable via the "Preview" button. */
	.is-desktop-preview {
		height: 100%;
		width: 100%;
		margin: 0;
		display: flex;
		flex-flow: column nowrap;
		background: #fff none repeat scroll 0% 0%;
	}
</style>
