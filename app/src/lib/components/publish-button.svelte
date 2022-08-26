<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import Button from './button.svelte';
	import editor from '$lib/stores/editor';

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
