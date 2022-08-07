<script lang="ts">
	import { getContext } from 'svelte';
	import Icon from './icons/icon.svelte';
	import type { Config } from '$types';

	export let href: string;

	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );
</script>

<a {href} class="components-external-link" target="_blank" rel="external noreferrer noopener"
	><slot /><span class="screen-reader-text">({l10n.opens_in_a_new_tab})</span><Icon
		class="components-external-link__icon"
		icon="external-small"
	/></a
>

<style>
	a :global( svg ) {
		width: 1em;
		height: 1em;
		margin: 0;
		vertical-align: middle;
		fill: currentcolor;
	}
</style>
