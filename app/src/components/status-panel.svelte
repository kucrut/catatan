<script lang="ts">
	import TrashButton from './trash-button.svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	const post = get_store( 'post' );
</script>

<!-- TODO: Remove this check when we have other rows ready. -->
{#if $post.status !== 'auto-draft' && $post.__can__.delete}
	<Panel title={__( 'Status & visibility' )}>
		<!-- <PanelRow>
			<span>{__( 'Visibility' )}</span>
		</PanelRow>
		<PanelRow>
			<span>{__( 'Publish' )}</span>
		</PanelRow> -->
		<PanelRow>
			<TrashButton />
		</PanelRow>
	</Panel>
{/if}
