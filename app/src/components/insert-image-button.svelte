<script lang="ts">
	import type { WP_Media, WP_Media_Size } from '$types';
	import Button from './button.svelte';
	import MediaFrame from './media-frame.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	const button_label = __( 'Insert image' );
	const frame_title = __( 'Select or Upload Media' );
	const size_names = [ 'medium', 'full' ];
	const store = get_store( 'editor' );

	let is_frame_open = false;

	const close_frame = () => ( is_frame_open = false );
	const open_frame = () => ( is_frame_open = true );

	function handle_select( event: CustomEvent< { selection: WP_Media[] } > ): void {
		const media = event.detail.selection.at( 0 );
		const { alt, caption, id, sizes } = media;
		let size_name: string;
		let size_data: WP_Media_Size;

		for ( const size of size_names ) {
			if ( size in sizes ) {
				size_name = size;
				size_data = sizes[ size_name ];
				break;
			}
		}

		$store.editor
			.chain()
			.focus()
			.insertContent( {
				type: 'wpImage',
				attrs: {
					attachmentId: id,
					size: size_name,
					imgAttrs: {
						alt,
						height: size_data.height,
						src: size_data.url,
						width: size_data.width,
						// TODO: srcset & sizes attributes.
					},
				},
				content: caption ? [ { type: 'text', text: caption } ] : undefined,
			} )
			.run();
	}
</script>

<Button icon="image" aria-label={button_label} on:click={open_frame} />

{#if is_frame_open}
	<MediaFrame options={{ title: frame_title }} type="insert" on:close={close_frame} on:select={handle_select} />
{/if}
