<script lang="ts">
	import { onMount } from 'svelte';
	import Container from '$lib/components/container.svelte';
	import editor_store from '$lib/stores/editor';
	import post_store from '$lib/stores/post';
	import post_type_store from '$lib/stores/post-type';
	import taxonomies_store from '$lib/stores/taxonomies';
	import type { Config } from '$types';

	export let config: Omit< Config, 'editor_id' | 'nonce' | 'rest_url' >;

	const { post_id, post_type, ...editor_config } = config;

	let is_ready = false;
	let loading_error: Error;

	onMount( async () => {
		try {
			post_type_store.set_params( { post_type } );
			await post_type_store.fetch();

			post_store.set_params( { post_id, type: $post_type_store } );
			await post_store.fetch();

			taxonomies_store.set_params( { post_type } );
			await taxonomies_store.fetch();

			editor_store.set_params( {
				post_id,
				...editor_config,
			} );
			is_ready = true;
		} catch ( error ) {
			loading_error = error;
		}
	} );
</script>

{#if is_ready}
	<Container />
{:else if loading_error}
	<p>{loading_error.message}</p>
{:else}
	<p>Loading...</p>
{/if}
