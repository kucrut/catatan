<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import Button from './button.svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
</script>

<Panel title={__( 'Status & visibility' )} let:is_expanded>
	<!-- <PanelRow {is_expanded}>
		<span>{__( 'Visibility' )}</span>
	</PanelRow>
	<PanelRow {is_expanded}>
		<span>{__( 'Publish' )}</span>
	</PanelRow> -->
	<PanelRow {is_expanded}>
		<Button is_destructive is_secondary class="editor-post-trash">{__( 'Move to trash' )}</Button>
	</PanelRow>
</Panel>
