<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { TermWithChildren } from '$stores/terms';
	import CheckboxControl from './checkbox-control.svelte';
	import sort_by from 'just-sort-by';
	import { get_store } from '$stores';

	export let class_prefix: string;
	export let taxonomy: Taxonomy;
	export let terms: TermWithChildren[];

	const editor = get_store( 'editor' );

	$: ( { rest_base: tax_name } = taxonomy );
	$: selected = $editor.data[ tax_name ] as number[];
	$: sorted_terms = sort_by( terms, ( { name } ) => name.toLocaleLowerCase() );

	function handle_check( event: Event & { target: HTMLInputElement } ): void {
		const id = Number( event.target.value );

		if ( selected.includes( id ) ) {
			editor.remove_term( tax_name, id );
		} else {
			editor.add_term( tax_name, id );
		}
	}
</script>

{#each sorted_terms as { children, id, name } (id)}
	<div class="{class_prefix}-choice">
		<CheckboxControl
			checked={selected.includes( id )}
			id="{tax_name}-{id}"
			label={name}
			value={id}
			on:change={handle_check}
		/>
		{#if children && children.length}
			<div class="{class_prefix}-subchoices">
				<svelte:self {class_prefix} {taxonomy} terms={children} />
			</div>
		{/if}
	</div>
{/each}
