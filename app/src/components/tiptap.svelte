<script lang="ts">
	import { Editor, type EditorOptions } from '@tiptap/core';
	import { onMount } from 'svelte';

	let cls = '';
	export { cls as class };
	export let options: Partial< EditorOptions >;

	// eslint-disable-next-line @typescript-eslint/no-empty-function
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

		return () => tiptap.destroy();
	} );
</script>

<div class={cls} bind:this={element} />
