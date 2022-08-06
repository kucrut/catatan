<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import type { Config } from '$types';
	import type { DocumentStore } from '$lib/stores/document';

	const doc = getContext< DocumentStore >( 'document' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	$: cls = '';
	$: icon = '';
	$: is_disabled = true;
	$: text = l10n.save_draft;

	$: {
		if ( $doc.is_saved ) {
			cls = 'is-saved';
		}

		if ( $doc.was_saving ) {
			icon = 'check';
			text = l10n.saved;
		}

		if ( $doc.is_dirty ) {
			cls = '';
			icon = '';
			is_disabled = false;
			text = l10n.save_draft;
		}

		if ( $doc.is_saving ) {
			cls = 'is-saving components-animate__loading';
			icon = 'cloud';
			is_disabled = true;
			text = l10n.saving;
		}

		if ( $doc.data.status && $doc.data.status !== 'draft' ) {
			text = l10n.switch_to_draft;
		}

		cls += ' editor-post-saved-state';
	}
</script>

<Button {icon} is_tertiary aria-disabled={is_disabled} class={cls} disabled={is_disabled} on:click={() => doc.save()}
	>{text}</Button
>
