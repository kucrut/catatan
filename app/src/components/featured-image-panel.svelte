<script lang="ts">
	import Panel from './panel.svelte';
	import { __ } from '@wordpress/i18n';
</script>

<Panel title={__( 'Featured image' )}>
	<div class="editor-post-featured-image">
		<button type="button" class="components-button editor-post-featured-image__toggle"
			>{__( 'Set featured image' )}</button
		>
	</div>
</Panel>
