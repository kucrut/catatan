<script lang="ts">
	import type { WP_Media } from '$types';
	import Button from './button.svelte';
	import MediaFrame from './media-frame.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';
	import { generate_attributes } from '$utils/media';

	const button_label = __( 'Insert image' );
	const frame_title = __( 'Select or Upload Media' );
	const media_store = get_store( 'media' );
	const blocks = get_store( 'blocks' );

	let should_open_frame = false;

	const close_frame = () => ( should_open_frame = false );
	const open_frame = () => ( should_open_frame = true );

	async function handle_select( event: CustomEvent< { selection: WP_Media[] } > ): Promise< void > {
		const { id } = event.detail.selection.at( 0 );
		const media = await media_store.get( id );
		const { caption, ...attrs } = generate_attributes( media, 'medium' );

		$blocks.editor
			.chain()
			.focus()
			.insertContent( {
				attrs,
				type: 'wpImage',
				content: caption ? [ { type: 'text', text: caption } ] : undefined,
			} )
			.run();
	}
</script>

<Button icon="image" aria-label={button_label} on:click={open_frame} />

{#if should_open_frame}
	<MediaFrame options={{ title: frame_title }} type="insert" on:close={close_frame} on:select={handle_select} />
{/if}
