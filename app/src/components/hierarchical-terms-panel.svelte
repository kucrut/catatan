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
	let is_creating_term = false;

	$: ( { rest_base: tax_name, labels, name, __can__ } = taxonomy );
	$: post_terms = $post[ tax_name ] as number[];

	function handle_check( id: number ): void {
		const current_terms = post_terms;
		const next_terms = current_terms.includes( id )
			? current_terms.filter( term_id => id === term_id )
			: current_terms.concat( id );

		editor.update( { [ tax_name ]: next_terms } );
	}

	function handle_click_toggle(): void {
		is_creating_term = ! is_creating_term;
		// TODO: Show/hide the form.
	}
</script>

<Panel title={name}>
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
	{#if __can__.create}
		<button
			aria-expanded={is_creating_term}
			class="components-button editor-post-taxonomies__hierarchical-terms-add is-link"
			type="button"
			on:click={handle_click_toggle}>{labels.add_new_item}</button
		>
	{/if}
</Panel>
