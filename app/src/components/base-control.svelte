<script lang="ts">
	import { class_names } from '$utils/css';

	let cls = '';
	export { cls as class };

	export let id = '';
	export let label = '';
	export let type = 'base';

	if ( type !== 'base' ) {
		cls = `${ cls } components-${ type }-control`;
	}
</script>

<div class={class_names( cls, 'components-base-control' )}>
	<div class="components-{type}-control__field">
		<slot name="before-label" />
		{#if id && label}
			<label class="components-{type}-control__label" for={id}>{label}</label>
		{/if}
		<slot />
	</div>
</div>

<style>
	.components-base-control__field,
	.components-base-control__label {
		margin-block-end: 0.5rem;
	}

	label {
		display: inline-block;
	}
</style>
