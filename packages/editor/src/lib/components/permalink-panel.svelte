<script lang="ts">
	import { getContext } from 'svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import type { Config } from '$types';

	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );
</script>

<Panel title={l10n.permalink} let:is_expanded>
	<PanelRow {is_expanded}>
		<p>{l10n.url_slug}</p>
	</PanelRow>
</Panel>
