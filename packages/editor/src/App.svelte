<script lang="ts">
	import { setContext } from 'svelte';
	import Container from '$lib/components/container.svelte';
	import type { Config } from '$types';

	export let config: Config;

	const { l10n } = config;

	setContext( 'l10n', l10n );
</script>

<div class="block-editor">
	<h1 class="screen-reader-text">{l10n.editor_title}</h1>
	<Container />
</div>
