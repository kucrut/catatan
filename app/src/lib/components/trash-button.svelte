<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );
</script>

<Button
	is_destructive
	is_secondary
	class="editor-post-trash"
	on:click={() => {
		editor.trash();
	}}>{__( 'Move to trash' )}</Button
>
