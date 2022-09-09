<script lang="ts">
	import Icon from './icons/icon.svelte';

	export let description: string;
	export let icon = '';
	export let title: string;

	const class_prefix = 'block-editor-block-card';
</script>

<div class={class_prefix}>
	{#if icon}
		<span class="block-editor-block-icon"><Icon {icon} /></span>
	{/if}
	<div class="{class_prefix}__content">
		<h2 class="{class_prefix}__title">{title}</h2>
		<span class="{class_prefix}__description">{description}</span>
	</div>
</div>
