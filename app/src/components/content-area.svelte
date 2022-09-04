<script lang="ts">
	import TitleInput from './title-input.svelte';
	import Lazy from './lazy.svelte';
	import debounce from 'just-debounce-it';
	import { get_store } from '$stores';

	export let with_editor: boolean;
	export let with_title: boolean;

	const store = get_store( 'editor' );
	const editor_options = {
		content: $store.data.content,
		onTransaction( { editor } ) {
			store.set_editor( editor );
		},
		onDestroy() {
			store.remove_editor();
		},
		onUpdate: debounce( ( { editor } ): void => {
			store.update( { content: editor.getHTML() } );
		}, 250 ),
	};
</script>

<div class="edit-post-visual-editor__content-area">
	<div class="is-desktop-preview">
		<div class="editor-styles-wrapper block-editor-writing-flow">
			{#if with_title}
				<TitleInput />
			{/if}
			{#if with_editor}
				{#await import( '$components/editor/extensions/extensions' ) then extensions}
					<Lazy
						class="is-root-container block-editor-block-list__layout"
						component={() => import( './tiptap.svelte' )}
						options={{ ...editor_options, extensions: extensions.get_extensions() }}
					/>
				{/await}
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
