<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import type { Config } from '$types';
	import type { DocumentStore } from '$lib/stores/document';

	const doc = getContext< DocumentStore >( 'document' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	let text: string;

	$: {
		if ( $doc.data.status === 'draft' ) {
			text = $doc.is_saved ? l10n.saved : l10n.save_draft;
		} else {
			text = l10n.switch_to_draft;
		}
	}
</script>

<Button is_tertiary aria-disabled={! $doc.is_dirty} disabled={! $doc.is_dirty}>{text}</Button>
