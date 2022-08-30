<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string;
	export let items: string[];
	export let search: string;

	const dispatch = createEventDispatcher< { select: number } >();
	const class_prefix = 'components-form-token-field';
	const id_prefix = 'components-form-token-suggestions';

	let hovered_index: number | null = null;
	// TODO: Handle up/down key events.

	$: regex = new RegExp( `(.*)(${ search })(.*)`, 'i' );
</script>

<ul class="{class_prefix}__suggestions-list" id="{id_prefix}-{id}" role="listbox">
	{#each items as label, index (index + label)}
		{@const  matched = regex.exec( label ) }
		<li
			aria-selected={hovered_index === index}
			class="{class_prefix}__suggestion"
			class:is-selected={hovered_index === index}
			id="{id_prefix}-{id}-{index}"
			role="option"
			on:click={() => dispatch( 'select', index )}
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
