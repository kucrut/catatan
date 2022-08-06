<script lang="ts">
	import { class_names } from '$lib/utils/css';
	import Icon from './icons/icon.svelte';

	let cls = '';
	export { cls as class };
	export let icon = '';
	export let type = 'button';
	export let is_primary = false;
	export let is_tertiary = false;
</script>

<button
	{type}
	class={class_names( cls, 'components-button' )}
	class:has-icon={icon !== ''}
	class:is-primary={is_primary}
	class:is-tertiary={is_tertiary}
	{...$$restProps}
	on:click
>
	{#if icon}
		<Icon {icon} />
	{/if}
	<slot />
</button>
