<script lang="ts">
	import Button from './button.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	const editor = get_store( 'editor' );
</script>

<Button is_destructive is_secondary class="editor-post-trash" on:click={() => editor.trash()}
	>{__( 'Move to trash' )}</Button
>
