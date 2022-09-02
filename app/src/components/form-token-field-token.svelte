<script lang="ts">
	import Button from './button.svelte';

	export let remove_text: string;
	export let description: string;
	export let id: number | string;
	export let label: string;

	const class_prefix = 'components-form-token-field__token';
</script>

<span class={class_prefix}
	><span class="{class_prefix}-text" id="{class_prefix}-text-{id}">
		{#if description}
			<span class="components-visually-hidden">{description}</span>
		{/if}
		<span aria-hidden="true">{label}</span>
	</span><Button
		aria-describedby="{class_prefix}-text-{id}"
		aria-label={remove_text}
		class="components-form-token-field__remove-token"
		icon="close"
		on:click
	/></span
>

<style>
	.components-visually-hidden {
		border: unset;
		clip: rect( 1px, 1px, 1px, 1px );
		clip-path: inset( 50% );
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
		overflow-wrap: normal;
	}
</style>
