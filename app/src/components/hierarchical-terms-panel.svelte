<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { TermsStore } from '$stores/terms';
	import CheckboxControl from './checkbox-control.svelte';
	import Panel from './panel.svelte';
	import { get_store } from '$stores';

	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const editor = get_store( 'editor' );
	const post = get_store( 'post' );

	$: ( { rest_base: tax_name } = taxonomy );
	$: post_terms = $post[ tax_name ] as number[];

	function handle_check( id: number ): void {
		const current_terms = post_terms;
		const next_terms = current_terms.includes( id )
			? current_terms.filter( term_id => id === term_id )
			: current_terms.concat( id );

		editor.update( { [ tax_name ]: next_terms } );
	}
</script>

<Panel title={taxonomy.name}>
	<div class="editor-post-taxonomies__hierarchical-terms-list">
		{#if $terms}
			{#each $terms as { id, name } (id)}
				<div class="editor-post-taxonomies__hierarchical-terms-choice">
					<CheckboxControl
						checked={post_terms.includes( id )}
						id="{tax_name}-{id}"
						label={name}
						value={id}
						on:change={() => handle_check( id )}
					/>
				</div>
			{/each}
		{/if}
	</div>
</Panel>
