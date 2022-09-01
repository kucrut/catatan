<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { get_store } from '$stores';
	import { onDestroy, onMount } from 'svelte';
	import { __ } from '@wordpress/i18n';
	import debounce from 'just-debounce-it';
	import placeholder from '@tiptap/extension-placeholder';
	import starter_kit from '@tiptap/starter-kit';

	const editor_store = get_store( 'editor' );

	let editor_el: HTMLDivElement;
	let editor_instance: Editor;

	onMount( () => {
		editor_instance = new Editor( {
			content: $editor_store.data.content,
			element: editor_el,
			extensions: [
				placeholder.configure( {
					placeholder: __( 'Start writing…' ),
				} ),
				starter_kit.configure( {
					heading: {
						levels: [ 2, 3, 4, 5, 6 ],
					},
				} ),
			],

			onTransaction() {
				// force re-render so `editor.isActive` works as expected.
				editor_instance = editor_instance;
			},
			onUpdate: debounce( ( { editor } ) => {
				editor_store.update( { content: editor.getHTML() } );
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
