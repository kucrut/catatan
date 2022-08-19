<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { getContext } from 'svelte';
	import TrashButton from './trash-button.svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import type { PostStore } from '$lib/stores/post';

	const post = getContext< PostStore >( 'post' );
</script>

<!-- TODO: Remove this check when we have other rows ready. -->
{#if $post.__can__.delete}
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
