<script lang="ts">
	import { afterUpdate, beforeUpdate, createEventDispatcher } from 'svelte';

	export let class_prefix: string;
	export let id: string;
	export let items: string[];
	export let search: string;
	export let selected_index: number | null = null;

	const id_prefix = 'components-form-token-suggestions';

	let list: HTMLUListElement;
	let list_height: number;
	let prev_selected_index = -1;
	let scroll_height: number;

	const dispatch = createEventDispatcher< { 'hover-item': number; 'select-item': number } >();

	function scroll_to_item( item: HTMLLIElement, going_up: boolean ): void {
		if ( scroll_height <= list_height ) {
			return;
		}

		let item_offset = item.offsetTop;

		if ( ! going_up ) {
			item_offset -= item.clientHeight;
		}

		if ( ( going_up && scroll_height > list_height ) || ( ! going_up && scroll_height > item_offset ) ) {
			list.scrollTo( 0, item_offset );
		}
	}

	$: regex = new RegExp( `(.*)(${ search })(.*)`, 'i' );

	beforeUpdate( () => {
		prev_selected_index = selected_index;
	} );

	afterUpdate( () => {
		list_height = list.clientHeight;
		scroll_height = list.scrollHeight;

		if ( selected_index !== null ) {
			scroll_to_item( list.children[ selected_index ] as HTMLLIElement, prev_selected_index < selected_index );
		}
	} );
</script>

<ul class="{class_prefix}__suggestions-list" id="{id_prefix}-{id}" role="listbox" bind:this={list}>
	{#each items as label, index (index + label)}
		{@const  matched = regex.exec( label ) }
		<li
			aria-selected={selected_index === index}
			class="{class_prefix}__suggestion"
			class:is-selected={selected_index === index}
			id="{id_prefix}-{id}-{index}"
			role="option"
			on:click={() => dispatch( 'select-item', index )}
			on:mouseenter={() => dispatch( 'hover-item', index )}
			on:mouseleave={() => dispatch( 'hover-item', null )}
		>
			<span aria-label={label}>
				{#if matched}
					{matched[ 1 ]}<strong class="{class_prefix}__suggestion-match">{matched[ 2 ]}</strong>{matched[ 3 ]}
				{:else}
					{label}
				{/if}
			</span>
		</li>
	{/each}
</ul>
