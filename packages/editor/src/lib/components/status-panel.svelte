<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
</script>

<Panel title={__( 'Status & visibility' )} let:is_expanded>
	<PanelRow {is_expanded}>
		<span>{__( 'Visibility' )}</span>
	</PanelRow>
	<PanelRow {is_expanded}>
		<span>{__( 'Publish' )}</span>
	</PanelRow>
</Panel>
