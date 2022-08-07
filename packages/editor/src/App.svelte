<script lang="ts">
	import { setContext } from 'svelte';
	import Container from '$lib/components/container.svelte';
	import create_editor_store from '$lib/stores/editor';
	import type { Config } from '$types';

	export let config: Omit< Config, 'editor_id' | 'nonce' | 'rest_url' >;

	const { l10n, ...editor_config } = config;
	const editor = create_editor_store( editor_config );

	setContext( 'editor', editor );
	setContext( 'l10n', l10n );
</script>

<svelte:window on:unload={() => editor.clear()} />

<div class="block-editor">
	<h1 class="screen-reader-text">{$editor.type?.labels?.edit_item}</h1>
	<Container />
</div>
