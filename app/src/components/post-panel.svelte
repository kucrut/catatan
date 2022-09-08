<script lang="ts">
	import ExcerptPanel from './excerpt-panel.svelte';
	import FeaturedImagePanel from './featured-image-panel.svelte';
	import FlatTermsPanel from './flat-terms-panel.svelte';
	import HierarchicalTermsPanel from './hierarchical-terms-panel.svelte';
	import PermalinkPanel from './permalink-panel.svelte';
	import StatusPanel from './status-panel.svelte';
	import { get_store } from '$stores';

	const post_type = get_store( 'post_type' );
	const taxonomies = get_store( 'taxonomies' );
</script>

<div class="components-panel">
	<StatusPanel />
	{#if $post_type.viewable}
		<PermalinkPanel />
	{/if}
	{#if $taxonomies.length}
		{#each $taxonomies as tax}
			{#if tax.__can__.assign}
				{#if tax.hierarchical}
					<HierarchicalTermsPanel taxonomy={tax} terms={taxonomies.get_terms_store( tax.slug )} />
				{:else}
					<FlatTermsPanel taxonomy={tax} terms={taxonomies.get_terms_store( tax.slug )} />
				{/if}
			{/if}
		{/each}
	{/if}
	{#if $post_type.supports.thumbnail}
		<FeaturedImagePanel />
	{/if}
	{#if $post_type.supports.excerpt}
		<ExcerptPanel />
	{/if}
</div>
