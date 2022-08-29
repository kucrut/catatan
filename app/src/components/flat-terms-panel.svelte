<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { TermsStore } from '$stores/terms';
	import FormTokenField from './form-token-field.svelte';
	import Panel from './panel.svelte';
	import { __ } from '@wordpress/i18n';
	import { onMount } from 'svelte';
	import { get_store } from '$stores';

	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const post = get_store( 'post' );
	const { labels, rest_base } = taxonomy;
	const { add_new_item } = labels;

	$: selected = $post[ rest_base ] as number[];

	onMount( () => {
		if ( selected && selected.length ) {
			terms.fetch( { include: selected } );
		}
	} );
</script>

<Panel title={taxonomy.name}>
	<FormTokenField help={__( 'Separate with commas or the Enter key.' )} id={rest_base} label={add_new_item} />
</Panel>
