<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { TermsStore } from '$stores/terms';
	import HierarchicalTermsChoice from './hierarchical-terms-choice.svelte';
	import Panel from './panel.svelte';

	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const class_prefix = 'editor-post-taxonomies__hierarchical-terms';
	let is_creating_term = false;

	$: ( { labels, name, __can__ } = taxonomy );

	function handle_click_toggle(): void {
		is_creating_term = ! is_creating_term;
		// TODO: Show/hide the form.
	}
</script>

<Panel title={name}>
	<div class="{class_prefix}-list">
		<HierarchicalTermsChoice {class_prefix} {taxonomy} {terms} />
	</div>
	{#if __can__.create}
		<button
			aria-expanded={is_creating_term}
			class="{class_prefix}-add components-button is-link"
			type="button"
			on:click={handle_click_toggle}>{labels.add_new_item}</button
		>
	{/if}
</Panel>
