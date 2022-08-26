<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import Button from './button.svelte';
	import editor from '$lib/stores/editor';
</script>

<Button
	is_destructive
	is_secondary
	class="editor-post-trash"
	on:click={() => {
		editor.trash();
	}}>{__( 'Move to trash' )}</Button
>
