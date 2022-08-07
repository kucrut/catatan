<script lang="ts">
	import { class_names } from '$lib/utils/css';
	import Icon from './icons/icon.svelte';

	let cls = '';
	export { cls as class };
	export let href = '';
	export let icon = '';
	export let icon_class = '';
	export let type = 'button';
	export let is_busy = false;
	export let is_primary = false;
	export let is_tertiary = false;

	$: tag = href ? 'a' : 'button';
	$: props = tag === 'a' ? { href } : { type };
</script>

<svelte:element
	this={tag}
	class={class_names( cls, 'components-button' )}
	class:has-icon={icon && ! icon_class}
	class:is-busy={is_busy}
	class:is-primary={is_primary}
	class:is-tertiary={is_tertiary}
	{...props}
	{...$$restProps}
	on:click
>
	{#if icon}
		<Icon {icon} class={icon_class} />
	{/if}
	<slot />
</svelte:element>
