<script lang="ts">
	import type { TokenItem } from '$types';
	import Button from './button.svelte';

	export let button_text: string;
	export let description: TokenItem[ 'description' ];
	export let id: TokenItem[ 'id' ];
	export let label: TokenItem[ 'label' ];

	const class_prefix = 'components-form-token-field__token';
</script>

<span class={class_prefix}
	><span class="{class_prefix}-text" id="{class_prefix}-text-{id}">
		<span class="components-visually-hidden">{description}</span>
		<span aria-hidden="true">{label}</span>
	</span><Button
		aria-describedby="{class_prefix}-text-{id}"
		aria-label={button_text}
		class="components-form-token-field__remove-token"
		icon="close"
		on:click
	/></span
>

<style>
	.components-visually-hidden {
		border: 0px none;
		clip: rect( 1px, 1px, 1px, 1px );
		clip-path: inset( 50% );
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0px;
		position: absolute;
		width: 1px;
		overflow-wrap: normal;
	}
</style>
