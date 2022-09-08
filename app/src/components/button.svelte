<script lang="ts">
	import { class_names } from '$utils/css';
	import Icon from './icons/icon.svelte';

	let cls = '';
	export { cls as class };
	export let href = '';
	export let icon = '';
	export let icon_class = '';
	export let is_busy = false;
	export let is_destructive = false;
	export let is_link = false;
	export let is_primary = false;
	export let is_secondary = false;
	export let is_tertiary = false;
	export let type = 'button';

	$: tag = href ? 'a' : 'button';
	$: props = tag === 'a' ? { href } : { type };
</script>

<svelte:element
	this={tag}
	class={class_names( cls, 'components-button' )}
	class:has-icon={icon && ! icon_class}
	class:is-busy={is_busy}
	class:is-destructive={is_destructive}
	class:is-link={is_link}
	class:is-primary={is_primary}
	class:is-secondary={is_secondary}
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
