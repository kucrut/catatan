<script lang="ts">
	import { __ } from '@wordpress/i18n';

	export let hidden = false;
</script>

<div {hidden} class="components-panel">
	<span class="block-editor-block-inspector__no-blocks">{__( 'No block selected.' )}</span>
</div>
