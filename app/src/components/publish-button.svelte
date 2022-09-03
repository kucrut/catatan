<script lang="ts">
	import Button from './button.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';
	import { is_draft } from '$utils/post';

	const editor = get_store( 'editor' );
	let is_disabled: boolean;

	$: is_draft_post = is_draft( $editor.data.status );
	// TODO: Schedule.
	$: text = is_draft_post ? __( 'Publish' ) : __( 'Update' );
	$: {
		if ( $editor.data.status === 'auto-draft' ) {
			is_disabled = true;
		} else {
			is_disabled = $editor.data.status === 'publish' && ! $editor.is_dirty;
		}
	}

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
