<script lang="ts">
	import type { SelectControlOption } from '$types';
	import type { Taxonomy } from '$stores/taxonomies';
	import type { TermsStore } from '$stores/terms';
	import HierarchicalTermsChoice from './hierarchical-terms-choice.svelte';
	import Panel from './panel.svelte';
	import SelectControl from './select-control.svelte';
	import TextControl from './text-control.svelte';

	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const class_prefix = 'editor-post-taxonomies__hierarchical-terms';
	let is_creating_term = false;
	let term_options: SelectControlOption[];

	$: ( { labels, name, slug, __can__ } = taxonomy );
	$: ( { add_new_item, parent_item, new_item_name } = labels );
	$: {
		if ( $terms ) {
			term_options = [
				{
					label: `— ${ parent_item } —`,
					value: '',
				},
				...$terms.map( ( { id, name } ) => ( { label: name, value: id } ) ),
			];
		}
	}

	function handle_click_toggle(): void {
		is_creating_term = ! is_creating_term;
	}
</script>

<Panel title={name}>
	<div class="{class_prefix}-list">
		<HierarchicalTermsChoice {class_prefix} {taxonomy} {terms} parent={0} />
	</div>
	{#if __can__.create}
		<button
			aria-expanded={is_creating_term}
			class="{class_prefix}-add components-button is-link"
			type="button"
			on:click={handle_click_toggle}>{add_new_item}</button
		>
		{#if is_creating_term}
			<div>
				<TextControl class="{class_prefix}-input" id="{class_prefix}-{slug}-input" label={new_item_name} />
				{#if term_options.length}
					<SelectControl
						id="{class_prefix}-{slug}-parent"
						label={parent_item}
						options={term_options}
						value={term_options[ 0 ].value}
					/>
				{/if}
				<button class="components-button {class_prefix}-submit is-secondary">{add_new_item}</button>
			</div>
		{/if}
	{/if}
</Panel>
