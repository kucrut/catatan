<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import Icon from './icons/icon.svelte';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );

	function get_url() {
		const url = new URL( $editor.data.link );
		url.searchParams.append( 'preview', 'true' );

		return url.toString();
	}

	$: props = $editor.data.link ? { href: get_url(), target: '_blank' } : { 'aria-disabled': true, 'disabled': true };
</script>

<Button is_tertiary {...props}>{__( 'Preview' )} <Icon icon="external" /></Button>
