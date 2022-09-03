<script lang="ts">
	import BaseControl from './base-control.svelte';

	let cls: string;

	export { cls as class };
	export let checked: boolean;
	export let id: string;
	export let label: string;

	const class_prefix = 'components-form-toggle';
</script>

<BaseControl {id} {label} class={`${ cls } components-base-control`} type="toggle">
	<span class={class_prefix} slot="before-label" class:is-checked={checked}>
		<input {checked} {id} class="{class_prefix}__input" type="checkbox" on:click />
		<span class="{class_prefix}__track" />
		<span class="{class_prefix}__thumb" />
	</span>
</BaseControl>
