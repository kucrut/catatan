<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { get_store } from '$stores';
	import { onDestroy, onMount } from 'svelte';
	import StarterKit from '@tiptap/starter-kit';

	const store = get_store( 'editor' );

	let editor_el: HTMLDivElement;
	let instance: Editor;

	onMount( () => {
		instance = new Editor( {
			content: $store.data.content,
			element: editor_el,
			extensions: [ StarterKit ],
			onTransaction() {
				// force re-render so `editor.isActive` works as expected.
				instance = instance;
			},
			onUpdate( { editor } ) {
				store.update( { content: editor.getHTML() } );
			},
		} );
	} );

	onDestroy( () => {
		if ( instance ) {
			instance.destroy();
		}
	} );
</script>

<div class="is-root-container block-editor-block-list__layout">
	<div bind:this={editor_el} />
</div>
