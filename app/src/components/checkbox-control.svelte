<script lang="ts">
	import BaseControl from './base-control.svelte';
	import Icon from './icons/icon.svelte';

	export let checked = false;
	export let id: string;
	export let label: string;
</script>

<BaseControl {id} {label} type="checkbox">
	<span class="components-checkbox-control__input-container" slot="before-label">
		<input {checked} {id} class="components-checkbox-control__input" type="checkbox" {...$$restProps} on:change />
		{#if checked}
			<Icon class="components-checkbox-control__checked" icon="check" />
		{/if}
	</span>
</BaseControl>
