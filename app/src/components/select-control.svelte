<script lang="ts">
	import type { SelectControlOption } from '$types';
	import BaseControl from './base-control.svelte';

	let cls = '';
	export { cls as class };
	export let id: string;
	export let label: string;
	export let options: SelectControlOption[];
	export let value: SelectControlOption[ 'value' ] = '';

	if ( ! value ) {
		value = options[ 0 ].value;
	}
</script>

<BaseControl class={cls}>
	<div class="components-flex components-select-control">
		<div class="components-flex-item">
			<label for={id} class="components-input-control__label">{label}</label>
		</div>
		<div class="components-input-control__container">
			<select class="components-select-control__input" {id} {value} {...$$restProps} on:change>
				{#each options as { label: opt_label, value: opt_value } (opt_value)}
					<option value={opt_value}>{opt_label}</option>
				{/each}
			</select>
		</div>
	</div>
</BaseControl>

<style>
	label {
		display: inline-block;
		margin-block-end: 0.5rem;
	}
</style>
