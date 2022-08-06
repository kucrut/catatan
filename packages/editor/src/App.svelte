<script lang="ts">
	import { setContext } from 'svelte';
	import Container from '$lib/components/container.svelte';
	import create_document_store from '$lib/stores/document';
	import type { Config } from '$types';

	export let config: Config;

	const { l10n, post_id } = config;

	setContext( 'document', create_document_store( post_id ) );
	setContext( 'l10n', l10n );
</script>

<div class="block-editor">
	<h1 class="screen-reader-text">{l10n.editor_title}</h1>
	<Container />
</div>
