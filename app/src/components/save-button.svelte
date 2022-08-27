<script lang="ts">
	import Button from './button.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';
	import { is_draft } from '$utils/post';

	const editor = get_store( 'editor' );

	$: cls = '';
	$: icon = '';
	$: is_disabled = true;
	$: is_not_draft = ! is_draft( $editor.data.status );
	$: text = __( 'Save draft' );

	function handle_click(): void {
		if ( is_not_draft ) {
			editor.update( { status: 'draft' } );
		}

		editor.save();
	}

	$: {
		if ( $editor.is_saved ) {
			cls = 'is-saved';
		}

		if ( $editor.was_saving ) {
			icon = 'check';
			text = __( 'Saved' );
		}

		if ( $editor.is_dirty ) {
			cls = '';
			icon = '';
			is_disabled = false;
			text = __( 'Save draft' );
		}

		if ( $editor.is_saving ) {
			cls = 'is-saving components-animate__loading';
			icon = 'cloud';
			is_disabled = true;
			text = __( 'Saving' );
		}

		if ( is_not_draft ) {
			icon = '';
			is_disabled = false;
			text = __( 'Switch to draft' );
		}

		cls += ' editor-post-saved-state';
	}
</script>

<Button {icon} is_tertiary aria-disabled={is_disabled} class={cls} disabled={is_disabled} on:click={handle_click}
	>{text}</Button
>
