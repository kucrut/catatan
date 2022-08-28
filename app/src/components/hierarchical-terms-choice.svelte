<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { TermsStore } from '$stores/terms';
	import CheckboxControl from './checkbox-control.svelte';
	import { get_store } from '$stores';

	export let class_prefix: string;
	export let parent = 0;
	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const editor = get_store( 'editor' );

	$: ( { rest_base: tax_name } = taxonomy );
	$: selected = $editor.data[ tax_name ] as number[];
	$: choices = $terms ? $terms.filter( ( { parent: parent_id } ) => parent === parent_id ) : [];

	function handle_check( id: number ): void {
		const next_selected = selected.includes( id )
			? selected.filter( term_id => id !== term_id )
			: selected.concat( id );

		editor.update( { [ tax_name ]: next_selected } );
	}
</script>

{#if choices.length}
	{#each choices as { id, name } (id)}
		{@const  children = $terms.filter( ( { parent: parent_id } ) => id === parent_id ) }
		<div class="{class_prefix}-choice">
			<CheckboxControl
				checked={selected.includes( id )}
				id="{tax_name}-{id}"
				label={name}
				value={id}
				on:change={() => handle_check( id )}
			/>
			{#if children.length}
				<div class="{class_prefix}-subchoices">
					<svelte:self {taxonomy} {terms} parent={id} />
				</div>
			{/if}
		</div>
	{/each}
{/if}
