<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import type { Config } from '$types';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	$: cls = '';
	$: icon = '';
	$: is_disabled = true;
	$: text = l10n.save_draft;
	$: handle_click = () => {
		editor.save();
	};

	$: {
		if ( $editor.is_saved ) {
			cls = 'is-saved';
		}

		if ( $editor.was_saving ) {
			icon = 'check';
			text = l10n.saved;
		}

		if ( $editor.is_dirty ) {
			cls = '';
			icon = '';
			is_disabled = false;
			text = l10n.save_draft;
		}

		if ( $editor.is_saving ) {
			cls = 'is-saving components-animate__loading';
			icon = 'cloud';
			is_disabled = true;
			text = l10n.saving;
		}

		if ( $editor.data.status && $editor.data.status !== 'draft' ) {
			icon = '';
			is_disabled = false;
			text = l10n.switch_to_draft;
			handle_click = () => {
				editor.update( { status: 'draft' } );
				editor.save();
			};
		}

		cls += ' editor-post-saved-state';
	}
</script>

<Button {icon} is_tertiary aria-disabled={is_disabled} class={cls} disabled={is_disabled} on:click={handle_click}
	>{text}</Button
>
