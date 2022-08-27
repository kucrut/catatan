<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import FormTokenField from './form-token-field.svelte';
	import Panel from './panel.svelte';
	import { __ } from '@wordpress/i18n';

	export let taxonomy: Taxonomy;

	const { labels, rest_base } = taxonomy;
	const { add_new_item } = labels;
</script>

<Panel title={taxonomy.name}>
	<FormTokenField help={__( 'Separate with commas or the Enter key.' )} id={rest_base} label={add_new_item} />
</Panel>
