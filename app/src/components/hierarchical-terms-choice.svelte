<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { TermsStore } from '$stores/terms';
	import CheckboxControl from './checkbox-control.svelte';
	import { get_store } from '$stores';

	export let class_prefix: string;
	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const editor = get_store( 'editor' );

	$: ( { rest_base: tax_name } = taxonomy );
	$: selected = $editor.data[ tax_name ] as number[];

	function handle_check( id: number ): void {
		const next_selected = selected.includes( id )
			? selected.filter( term_id => id !== term_id )
			: selected.concat( id );

		editor.update( { [ tax_name ]: next_selected } );
	}
</script>

{#if $terms}
	{#each $terms as { id, name } (id)}
		<div class="{class_prefix}-choice">
			<CheckboxControl
				checked={selected.includes( id )}
				id="{tax_name}-{id}"
				label={name}
				value={id}
				on:change={() => handle_check( id )}
			/>
		</div>
	{/each}
{/if}
