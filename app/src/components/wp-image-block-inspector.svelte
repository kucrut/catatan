<script>
	import { __ } from '@wordpress/i18n';
	import BlockCard from './block-card.svelte';
</script>

<div class="block-editor-block-inspector">
	<BlockCard description={__( 'Insert an image to make a visual statement.' )} icon="image" title={__( 'Image' )} />
</div>
