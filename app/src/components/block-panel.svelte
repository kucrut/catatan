<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';
	import WpImageBlockInspector from './wp-image-block-inspector.svelte';

	export let hidden = false;

	const blocks = get_store( 'blocks' );
</script>

{#if $blocks.editor}
	<div {hidden} class="components-panel">
		{#if $blocks.editor.isActive( 'wpImage' )}
			<WpImageBlockInspector />
		{:else}
			<span class="block-editor-block-inspector__no-blocks">{__( 'No block selected.' )}</span>
		{/if}
	</div>
{/if}
