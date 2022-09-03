<script lang="ts">
	import { Editor, type EditorOptions } from '@tiptap/core';
	import { onDestroy, onMount } from 'svelte';

	let cls = '';
	export { cls as class };
	export let options: Partial< EditorOptions >;

	const { onTransaction = () => {} } = options;

	let element: HTMLDivElement;
	let tiptap: Editor;

	onMount( () => {
		tiptap = new Editor( {
			...options,
			element,
			onTransaction( ...args ) {
				// Force re-render so `editor.isActive` works as expected.
				tiptap = tiptap;
				onTransaction( ...args );
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
