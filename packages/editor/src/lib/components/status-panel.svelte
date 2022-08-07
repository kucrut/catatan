<script lang="ts">
	import { getContext } from 'svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import type { Config } from '$types';

	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );
</script>

<Panel title={l10n.status_panel_title} let:is_expanded>
	<PanelRow {is_expanded}>
		<span>{l10n.visibility}</span>
	</PanelRow>
	<PanelRow {is_expanded}>
		<span>{l10n.publish}</span>
	</PanelRow>
</Panel>
