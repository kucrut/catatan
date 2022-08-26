<script lang="ts">
	import textarea_autosize from '@github/textarea-autosize';
	import editor from '$lib/stores/editor';

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
