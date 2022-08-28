<script lang="ts">
	import BaseControl from './base-control.svelte';

	export let id: string;
	export let label: string;
</script>

<BaseControl {id} {label} type="checkbox">
	<span class="components-checkbox-control__input-container" slot="before-label">
		<input {id} class="components-checkbox-control__input" type="checkbox" {...$$restProps} on:change />
	</span>
</BaseControl>
