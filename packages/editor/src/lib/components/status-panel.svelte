<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );
</script>

<Panel title={__( 'Status & visibility' )} let:is_expanded>
	<!-- <PanelRow {is_expanded}>
		<span>{__( 'Visibility' )}</span>
	</PanelRow>
	<PanelRow {is_expanded}>
		<span>{__( 'Publish' )}</span>
	</PanelRow> -->
	{#if editor.user_can( 'delete' ) && $editor.data.id}
		<PanelRow {is_expanded}>
			<Button is_destructive is_secondary class="editor-post-trash">{__( 'Move to trash' )}</Button>
		</PanelRow>
	{/if}
</Panel>
