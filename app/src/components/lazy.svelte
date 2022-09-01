<script>
	export let component;
</script>

{#await component.then ? component : component() then Component}
	<svelte:component this={Component.default} {...$$restProps} />
{/await}
