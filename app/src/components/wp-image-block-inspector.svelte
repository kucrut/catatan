<script lang="ts">
	import type { WP_REST_API_Media } from '$types';
	import BaseControlHelp from './base-control-help.svelte';
	import BlockCard from './block-card.svelte';
	import ExternalLink from './external-link.svelte';
	import Panel from './panel.svelte';
	import SelectControl from './select-control.svelte';
	import TextareaControl from './textarea-control.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_attachment_size_options, generate_attributes } from '$utils/media';
	import { get_store } from '$stores';
	import { onMount } from 'svelte';
	import BlockAlignmentSetting from './block-alignment-setting.svelte';

	const blocks = get_store( 'blocks' );
	const media = get_store( 'media' );
	const block_type = 'wpImage';
	let attachment: WP_REST_API_Media;

	$: attributes = $blocks.editor.getAttributes( block_type );

	function handle_alt_change( event: InputEvent & { currentTarget: HTMLTextAreaElement } ) {
		$blocks.editor.commands.updateAttributes( block_type, {
			...attributes,
			img: {
				...attributes.img,
				alt: event.currentTarget.value,
			},
		} );
	}

	function handle_size_change( event: Event & { target: HTMLSelectElement } ) {
		$blocks.editor.commands.updateAttributes( block_type, generate_attributes( attachment, event.target.value ) );
	}

	onMount( async () => {
		attachment = await media.get( attributes.id );
	} );
</script>

<div class="block-editor-block-inspector">
	<BlockCard description={__( 'Insert an image to make a visual statement.' )} icon="image" title={__( 'Image' )} />

	<Panel id="wp-image-block-size" title={__( 'Image settings' )}>
		{#if attachment}
			<TextareaControl
				id="image-alt"
				label={__( 'Alt text (alternative text)' )}
				value={attributes.img.alt}
				on:input={handle_alt_change}
			>
				<BaseControlHelp slot="help">
					<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree"
						>{__( 'Describe the purpose of the image' )}</ExternalLink
					>{__( 'Leave empty if the image is purely decorative.' )}
				</BaseControlHelp>
			</TextareaControl>
			<SelectControl
				id="image-size"
				label={__( 'Image size' )}
				options={get_attachment_size_options( attachment, $blocks.image_size_names )}
				value={attributes.size}
				on:change={handle_size_change}
			/>
			<BlockAlignmentSetting type={block_type} />
		{/if}
	</Panel>
</div>
