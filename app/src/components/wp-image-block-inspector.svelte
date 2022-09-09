<script lang="ts">
	import type { WP_REST_API_Media } from '$types';
	import BlockCard from './block-card.svelte';
	import Panel from './panel.svelte';
	import SelectControl from './select-control.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_attachment_size_options, generate_attributes } from '$utils/media';
	import { get_store } from '$stores';
	import { onMount } from 'svelte';

	const blocks = get_store( 'blocks' );
	const media = get_store( 'media' );
	const block_name = 'wpImage';
	let attachment: WP_REST_API_Media;

	$: attributes = $blocks.editor.getAttributes( block_name );

	function handle_size_change( event: Event & { target: HTMLSelectElement } ) {
		$blocks.editor.commands.updateAttributes( block_name, generate_attributes( attachment, event.target.value ) );
	}

	onMount( async () => {
		attachment = await media.get( attributes.id );
	} );
</script>

<div class="block-editor-block-inspector">
	<BlockCard description={__( 'Insert an image to make a visual statement.' )} icon="image" title={__( 'Image' )} />

	<Panel id="wp-image-block-size" title={__( 'Image settings' )}>
		{#if attachment}
			<SelectControl
				id="image-size"
				label={__( 'Image size' )}
				options={get_attachment_size_options( attachment )}
				value={attributes.size}
				on:change={handle_size_change}
			/>
		{/if}
	</Panel>
</div>
