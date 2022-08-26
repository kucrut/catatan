<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );

	$: cls = '';
	$: icon = '';
	$: is_disabled = true;
	$: is_not_draft = $editor.data.status && $editor.data.status !== 'draft';
	$: text = __( 'Save draft' );

	function handle_click() {
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
