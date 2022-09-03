<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { get_store } from '$stores';
	import { onDestroy, onMount } from 'svelte';
	import debounce from 'just-debounce-it';

	interface CallbackArgs {
		editor: Editor;
	}

	const editor_store = get_store( 'editor' );

	let editor_el: HTMLDivElement;
	let editor_instance: Editor;

	onMount( async () => {
		const { get_extensions } = await import( './extensions/extensions' );

		editor_instance = new Editor( {
			content: $editor_store.data.content,
			element: editor_el,
			extensions: get_extensions(),

			onTransaction() {
				// force re-render so `editor.isActive` works as expected.
				editor_instance = editor_instance;
			},
			onUpdate: debounce( ( { editor }: CallbackArgs ): void => {
				editor_store.update( { content: editor.getHTML() } );
				console.log( editor.getJSON() );
			}, 250 ),
		} );
	} );

	onDestroy( () => {
		if ( editor_instance instanceof Editor ) {
			editor_instance.destroy();
		}
	} );
</script>

<div class="is-root-container block-editor-block-list__layout" bind:this={editor_el} />
