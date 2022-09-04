<script lang="ts">
	import debounce from 'just-debounce-it';
	import { get_store } from '$stores';

	const store = get_store( 'editor' );
	const options = {
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

	const promises = Promise.all( [ import( './tiptap.svelte' ), import( '../tiptap-extensions/extensions' ) ] );
</script>

{#await promises then [component, extensions]}
	<svelte:component
		this={component.default}
		class="is-root-container block-editor-block-list__layout"
		options={{ ...options, extensions: extensions.get_extensions() }}
	/>
{/await}
