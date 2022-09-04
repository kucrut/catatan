<script lang="ts">
	export let tag_name = 'span';
</script>

<svelte:element this={tag_name} class="components-visually-hidden" {...$$restProps}><slot /></svelte:element>

<style>
	.components-visually-hidden {
		border: 0 none;
		clip: rect( 1px, 1px, 1px, 1px );
		clip-path: inset( 50% );
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
		overflow-wrap: normal;
	}
</style>
