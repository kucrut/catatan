<script lang="ts">
	import type { EditorOptions } from '@tiptap/core';
	import debounce from 'just-debounce-it';
	import omit from 'just-omit';
	import { get_store } from '$stores';

	const blocks = get_store( 'blocks' );
	const store = get_store( 'editor' );

	const options: Partial< EditorOptions > = {
		content: $store.data.content,
		onTransaction( { editor } ) {
			blocks.update( $blocks => ( {
				...$blocks,
				editor,
			} ) );
		},
		onDestroy() {
			blocks.update( $blocks => omit( $blocks, [ 'editor' ] ) );
		},
		onUpdate: debounce( ( { editor } ): void => {
			store.update( { content: editor.getHTML() } );
		}, 250 ),
	};

	const promises = Promise.all( [ import( './tiptap.svelte' ), import( '../tiptap-extensions/extensions' ) ] );
</script>

{#await promises then [component, extensions]}
	<svelte:component
		this={component.default}
		class="is-root-container block-editor-block-list__layout"
		options={{ ...options, extensions: extensions.get_extensions() }}
	/>
{/await}
