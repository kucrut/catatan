<script lang="ts">
	import Button from './button.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';
	import { is_draft } from '$utils/post';

	const editor = get_store( 'editor' );

	$: is_disabled = ! ( $editor.data.content || $editor.data.title );
	// TODO: Schedule.
	$: text = is_draft( $editor.data.status ) ? __( 'Publish' ) : __( 'Update' );

	function handle_click(): void {
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
