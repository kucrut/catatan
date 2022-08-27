<script lang="ts">
	import Button from './button.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$lib/stores';

	const editor = get_store( 'editor' );

	$: is_disabled = ! ( $editor.data.content || $editor.data.title );
	// TODO: Schedule.
	$: text = $editor.data.status && $editor.data.status !== 'draft' ? __( 'Update' ) : __( 'Publish' );

	function handle_click() {
		if ( $editor.data.status === 'draft' ) {
			editor.update( { status: 'publish' } );
		}

		editor.save();
	}
</script>

<Button
	is_primary
	aria-disabled={is_disabled}
	disabled={is_disabled}
	is_busy={$editor.is_saving}
	on:click={handle_click}>{text}</Button
>
