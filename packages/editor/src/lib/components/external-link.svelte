<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import Icon from './icons/icon.svelte';

	export let href: string;
</script>

<a {href} class="components-external-link" target="_blank" rel="external noreferrer noopener"
	><slot /><span class="screen-reader-text">({__( 'opens in a new tab' )})</span><Icon
		class="components-external-link__icon"
		icon="external"
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
