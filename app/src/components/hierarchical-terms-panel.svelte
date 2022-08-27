<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	// import CheckboxControl from './checkbox-control.svelte';
	import Panel from './panel.svelte';

	export let taxonomy: Taxonomy;
</script>

<Panel title={taxonomy.name}>
	<div class="editor-post-taxonomies__hierarchical-terms-list">
		<div class="editor-post-taxonomies__hierarchical-terms-choice">
			<!-- <CheckboxControl id="bleh" label="boohooo" /> -->
		</div>
	</div>
</Panel>
