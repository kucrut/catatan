<script lang="ts">
	import { setContext } from 'svelte';
	import Container from '$lib/components/container.svelte';
	import create_editor_store from '$lib/stores/editor';
	import type { Config } from '$types';

	export let config: Omit< Config, 'editor_id' | 'nonce' | 'rest_url' >;

	const { l10n, ...editor_config } = config;

	setContext( 'editor', create_editor_store( editor_config ) );
	setContext( 'l10n', l10n );
</script>

<div class="block-editor">
	<h1 class="screen-reader-text">{l10n.editor_title}</h1>
	<Container />
</div>
