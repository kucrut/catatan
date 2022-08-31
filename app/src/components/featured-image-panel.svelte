<script lang="ts">
	import Panel from './panel.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	const editor = get_store( 'editor' );
</script>

<Panel title={__( 'Featured image' )}>
	<div class="editor-post-featured-image">
		{#if ! $editor.data.featured_media}
			<button type="button" class="components-button editor-post-featured-image__toggle"
				>{__( 'Set featured image' )}</button
			>
		{/if}
	</div>
</Panel>
