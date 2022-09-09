<script lang="ts">
	import Button from './button.svelte';
	import { class_names } from '$utils/css';
	import { createEventDispatcher } from 'svelte';

	interface Item {
		id: number | string;
		label: string;
	}

	export let label: string;
	export let items: Item[];
	export let value: Item[ 'id' ];

	const dispatch = createEventDispatcher< { select: Item[ 'id' ] } >();
</script>

<div aria-label={label} class="components-button-group" role="group">
	<slot name="before-items" />
	{#each items as { id, label }, index (`${ index }-${ id }`)}
		{@const  is_selected = id === value }
		{@const  cls = class_names( is_selected ? 'is-pressed' : '', 'is-small' ) }
		<Button aria-pressed={id === value} class={cls} is_primary={is_selected} on:click={() => dispatch( 'select', id )}
			>{label}</Button
		>
	{/each}
	<slot name="after-items" />
</div>
