<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import type { Config } from '$types';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	$: cls = 'editor-post-publish-button__button';
	$: is_disabled = ! ( $editor.data.content || $editor.data.title );

	function handle_click() {
		editor.update( { status: 'publish' } );
		editor.save();
	}
</script>

<Button is_primary aria-disabled={is_disabled} class={cls} disabled={is_disabled} on:click={handle_click}
	>{l10n.publish}</Button
>
