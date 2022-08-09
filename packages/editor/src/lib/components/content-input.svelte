<script lang="ts">
	import { getContext } from 'svelte';
	import textarea_autosize from '@github/textarea-autosize';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );

	function autosize( node: HTMLTextAreaElement ) {
		textarea_autosize( node );
	}

	function handle_input( event: Event & { currentTarget: HTMLTextAreaElement } ) {
		editor.update( { content: event.currentTarget.value } );
	}
</script>

<div class="is-root-container block-editor-block-list__layout">
	<textarea class="widefat" on:input={handle_input} use:autosize>{$editor.data.content}</textarea>
</div>

<style>
	textarea {
		display: block;
		min-height: 10rem;
		font-size: 1em;
	}
</style>
