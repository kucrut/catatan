<script lang="ts">
	import Button from './button.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';
	import { is_draft } from '$utils/post';

	const editor = get_store( 'editor' );

	$: is_draft_post = is_draft( $editor.data.status );
	$: is_disabled = ! ( $editor.data.content || $editor.data.title );
	// TODO: Schedule.
	$: text = is_draft_post ? __( 'Publish' ) : __( 'Update' );

	function handle_click(): void {
		if ( is_draft_post ) {
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
