<script lang="ts">
	import Button from './button.svelte';
	import Icon from './icons/icon.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$lib/stores';

	const editor = get_store( 'editor' );

	function get_url(): string {
		const url = new URL( $editor.data.link );
		url.searchParams.append( 'preview', 'true' );

		return url.toString();
	}

	$: props = $editor.data.link ? { href: get_url(), target: '_blank' } : { 'aria-disabled': true, 'disabled': true };
</script>

<Button is_tertiary {...props}>{__( 'Preview' )} <Icon icon="external" /></Button>
