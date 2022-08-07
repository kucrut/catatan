<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import type { Config } from '$types';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	$: is_disabled = ! ( $editor.data.content || $editor.data.title );
	// TODO: Schedule.
	$: text = $editor.data.status && $editor.data.status !== 'draft' ? l10n.update : l10n.publish;

	function handle_click() {
		if ( $editor.data.status === 'draft' ) {
			editor.update( { status: 'publish' } );
		}

		editor.save();
	}
</script>

<Button is_primary aria-disabled={is_disabled} disabled={is_disabled} on:click={handle_click}>{text}</Button>
