<script lang="ts">
	import Button from './button.svelte';
	import VisuallyHidden from './visually-hidden.svelte';

	export let class_prefix: string;
	export let remove_text: string;
	export let description: string;
	export let id: number | string;
	export let label: string;
</script>

<span class="{class_prefix}__token"
	><span class="{class_prefix}__token-text" id="{class_prefix}__token-text-{id}">
		{#if description}
			<VisuallyHidden>{description}</VisuallyHidden>
		{/if}
		<span aria-hidden="true">{label}</span>
	</span><Button
		aria-describedby="{class_prefix}__token-text-{id}"
		aria-label={remove_text}
		class="{class_prefix}__remove-token"
		icon="close"
		on:click
	/></span
>
