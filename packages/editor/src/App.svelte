<script lang="ts">
	import { onMount } from 'svelte';
	import Container from '$lib/components/container.svelte';
	import create_notices_store, { type NoticesStore } from '$lib/stores/notices';
	import create_editor_store, { type EditorStore } from '$lib/stores/editor';
	import create_post_store, { type PostStore } from '$lib/stores/post';
	import create_post_type_store, { type PostTypeStore } from '$lib/stores/post-type';
	import type { Config } from '$types';

	export let config: Omit< Config, 'editor_id' | 'nonce' | 'rest_url' >;

	const { post_id, post_type, ...editor_config } = config;

	let editor_store: EditorStore;
	let is_ready = false;
	let loading_error: Error;
	let notices_store: NoticesStore;
	let post_store: PostStore;
	let post_type_store: PostTypeStore;

	onMount( async () => {
		try {
			notices_store = create_notices_store();
			post_type_store = create_post_type_store( post_type );
			await post_type_store.fetch();

			console.log( $post_type_store );

			post_store = create_post_store( post_id, $post_type_store );
			await post_store.fetch();

			editor_store = create_editor_store( {
				notices_store,
				post_id,
				post_store,
				post_type_store,
				...editor_config,
			} );
			is_ready = true;
		} catch ( error ) {
			loading_error = error;
		}
	} );
</script>

{#if is_ready}
	<Container {editor_store} {notices_store} {post_store} {post_type_store} />
{:else if loading_error}
	<p>{loading_error.message}</p>
{:else}
	<p>Loading...</p>
{/if}
