<script lang="ts">
	export let id = '';
	export let label = '';
</script>

<div class="components-base-control">
	<div class="components-base-control__field">
		<slot name="before-label" />
		{#if id && label}
			<label class="components-base-control__label" for={id}>{label}</label>
		{/if}
		<slot />
	</div>
</div>

<style>
	.components-base-control__field,
	label {
		margin-block-end: 0.5rem;
	}

	label {
		display: inline-block;
	}
</style>
