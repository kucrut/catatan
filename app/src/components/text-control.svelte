<script lang="ts">
	import BaseControl from './base-control.svelte';

	let cls = '';
	export { cls as class };
	export let id: string;
	export let label: string;
</script>

<BaseControl {id} {label} class={cls}>
	<input {id} class="components-text-control__input" type="text" {...$$restProps} on:change on:input />
</BaseControl>
