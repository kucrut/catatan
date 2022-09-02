<script lang="ts">
	import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
	import { onDestroy } from 'svelte';

	export let id: string;
	export let input_el: HTMLInputElement;
	export let items: string[];
	export let search: string;

	const dispatch = createEventDispatcher< { 'hover-item': number; 'select-item': number } >();
	const class_prefix = 'components-form-token-field';
	const id_prefix = 'components-form-token-suggestions';
	const keys_to_watch = [ 'Enter', 'ArrowDown', 'ArrowUp' ];

	let list: HTMLUListElement;
	let hovered_index: number | null = null;
	let list_height: number;
	let scroll_height: number;

	function hover_item( index: typeof hovered_index ): void {
		dispatch( 'hover-item', index );
	}

	function select_item( index: number ): void {
		dispatch( 'select-item', index );
	}

	function scroll_to_item( going_up: boolean ): void {
		if ( scroll_height <= list_height ) {
			return;
		}

		const item = list.children[ hovered_index ] as HTMLLIElement;
		let item_offset = item.offsetTop;

		if ( ! going_up ) {
			item_offset -= item.clientHeight;
		}

		if ( ( going_up && scroll_height > list_height ) || ( ! going_up && scroll_height > item_offset ) ) {
			list.scrollTo( 0, item_offset );
		}
	}

	function handle_keydown( event: KeyboardEvent ): void {
		const { code } = event;

		if ( ! keys_to_watch.includes( code ) ) {
			return;
		}

		event.preventDefault();

		const total = items.length;

		switch ( code ) {
			case 'ArrowDown':
				hovered_index = hovered_index === null || hovered_index + 1 === total ? 0 : hovered_index + 1;
				scroll_to_item( false );
				break;

			case 'ArrowUp':
				hovered_index = hovered_index === null || hovered_index === 0 ? total - 1 : hovered_index - 1;
				scroll_to_item( true );
				break;

			default: // Enter.
				if ( hovered_index !== null ) {
					select_item( hovered_index );
				}
				break;
		}
	}

	$: regex = new RegExp( `(.*)(${ search })(.*)`, 'i' );

	onMount( () => {
		list_height = list.clientHeight;
		scroll_height = list.scrollHeight;

		if ( input_el ) {
			input_el.addEventListener( 'keydown', handle_keydown );
		}
	} );

	beforeUpdate( () => {
		hover_item( hovered_index );
	} );

	onDestroy( () => {
		hover_item( null );
		input_el.removeEventListener( 'keydown', handle_keydown );
	} );
</script>

<ul class="{class_prefix}__suggestions-list" id="{id_prefix}-{id}" role="listbox" bind:this={list}>
	{#each items as label, index (index + label)}
		{@const  matched = regex.exec( label ) }
		<li
			aria-selected={hovered_index === index}
			class="{class_prefix}__suggestion"
			class:is-selected={hovered_index === index}
			id="{id_prefix}-{id}-{index}"
			role="option"
			on:click={() => select_item( index )}
			on:mouseenter={() => ( hovered_index = index )}
			on:mouseleave={() => ( hovered_index = null )}
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

<style>
	ul {
		position: relative;
	}
</style>
