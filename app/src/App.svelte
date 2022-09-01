<script lang="ts">
	import Container from '$components/container.svelte';
	import { onMount } from 'svelte';
	import { init_stores, type StoresConfig } from '$stores';

	import './global.css';

	export let config: StoresConfig;

	let is_ready = false;
	let loading_error: Error;

	onMount( async () => {
		try {
			await init_stores( config );
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
