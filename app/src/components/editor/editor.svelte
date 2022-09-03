<script lang="ts">
	import { Editor, type EditorOptions } from '@tiptap/core';
	import { onDestroy, onMount } from 'svelte';

	let cls = '';
	export { cls as class };
	export let options: Partial< EditorOptions >;

	let element: HTMLDivElement;
	let tiptap: Editor;

	onMount( () => {
		tiptap = new Editor( {
			...options,
			element,
			onTransaction() {
				// Force re-render so `editor.isActive` works as expected.
				tiptap = tiptap;
			},
		} );
	} );

	onDestroy( () => {
		if ( tiptap instanceof Editor ) {
			tiptap.destroy();
		}
	} );
</script>

<div class={cls} bind:this={element} />
