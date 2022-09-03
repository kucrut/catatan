<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { get_store } from '$stores';
	import { onDestroy, onMount } from 'svelte';
	import debounce from 'just-debounce-it';

	interface CallbackArgs {
		editor: Editor;
	}

	let cls = '';
	export { cls as class };

	const store = get_store( 'editor' );

	let element: HTMLDivElement;
	let tiptap: Editor;

	onMount( async () => {
		const { get_extensions } = await import( './extensions/extensions' );

		tiptap = new Editor( {
			element,
			content: $store.data.content,
			extensions: get_extensions(),

			onTransaction() {
				// Force re-render so `editor.isActive` works as expected.
				tiptap = tiptap;
			},
			onUpdate: debounce( ( { editor }: CallbackArgs ): void => {
				store.update( { content: editor.getHTML() } );
			}, 250 ),
		} );
	} );

	onDestroy( () => {
		if ( tiptap instanceof Editor ) {
			tiptap.destroy();
		}
	} );
</script>

<div class={cls} bind:this={element} />
