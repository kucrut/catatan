<script lang="ts">
	import Button from './button.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$lib/stores';

	const editor = get_store( 'editor' );

	function trash(): void {
		editor.trash();
	}
</script>

<Button is_destructive is_secondary class="editor-post-trash" on:click={trash}>{__( 'Move to trash' )}</Button>
