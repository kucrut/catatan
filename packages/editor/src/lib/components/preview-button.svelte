<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import Icon from './icons/icon.svelte';
	import type { Config } from '$types';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	function get_url() {
		const url = new URL( $editor.data.link );
		url.searchParams.append( 'preview', 'true' );

		return url.toString();
	}

	$: props = $editor.data.link ? { href: get_url(), target: '_blank' } : { 'aria-disabled': true, 'disabled': true };
</script>

<Button is_tertiary {...props}>{l10n.preview} <Icon icon="external" /></Button>
