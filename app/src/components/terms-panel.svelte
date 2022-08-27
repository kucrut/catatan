<script lang="ts">
	import type { WP_REST_API_Taxonomy } from 'wp-types';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import { __ } from '@wordpress/i18n';

	export let taxonomy: WP_REST_API_Taxonomy;
</script>

<Panel title={taxonomy.name}>
	<PanelRow />
</Panel>
