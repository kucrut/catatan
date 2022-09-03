<script lang="ts">
	import type { WP_Media } from '$types';
	import Button from './button.svelte';
	import MediaFrame from './media-frame.svelte';
	import Panel from './panel.svelte';
	import { sprintf, __ } from '@wordpress/i18n';
	import { get_store } from '$stores';
	import { onMount } from 'svelte';

	interface Media {
		alt: string;
		filename: string;
		id: number;
		url: string;
	}

	const editor = get_store( 'editor' );
	const media = get_store( 'media' );
	const post_type = get_store( 'post_type' );

	const DEFAULT_DESCRIPTION = __( 'The current image has no alternative text. The file name is: %s' );
	const DEFAULT_REMOVE_LABEL = __( 'Remove featured image' );
	const DEFAULT_SET_LABEL = __( 'Set featured image' );
	const DEFAULT_TITLE = __( 'Featured image' );
	const class_prefix = 'editor-post-featured-image';

	let is_frame_open = false;
	let selected: Media;

	const close_frame = () => ( is_frame_open = false );
	const open_frame = () => ( is_frame_open = true );

	const set = ( id: number ) => {
		editor.update( { featured_media: id } );

		if ( id < 1 ) {
			selected = undefined;
		}
	};

	function handle_select( event: CustomEvent< { selection: WP_Media[] } > ): void {
		const { alt, filename, id, sizes, mime } = event.detail.selection.at( 0 );

		// TODO: Prevent this from the media frame's upload tab.
		if ( ! mime.startsWith( 'image' ) ) {
			return;
		}

		set( id );
		selected = { alt, filename, id, url: sizes.thumbnail?.url || sizes.full.url };
	}

	$: remove_label = $post_type.labels.remove_featured_image || DEFAULT_REMOVE_LABEL;
	$: set_label = $post_type.labels.set_featured_image || DEFAULT_SET_LABEL;
	$: title = $post_type.labels.featured_image || DEFAULT_TITLE;
	$: description = selected ? selected.alt || sprintf( DEFAULT_DESCRIPTION, selected.filename ) : '';

	onMount( async () => {
		if ( $editor.data.featured_media ) {
			try {
				const { alt_text: alt, id, media_details } = await media.fetch( $editor.data.featured_media );
				const { original_image: filename, sizes } = media_details;
				selected = { alt, filename, id, url: sizes.thumbnail?.source_url || sizes.full.source_url };
			} catch {
				// TODO
			}
		}
	} );
</script>

<Panel id="featured-image" {title}>
	<div class={class_prefix}>
		{#if is_frame_open}
			<MediaFrame
				selected={[ $editor.data.featured_media ]}
				type="featured-image"
				on:close={close_frame}
				on:select={handle_select}
			/>
		{/if}
		{#if $editor.data.featured_media}
			{#if selected}
				<div id="{class_prefix}-{selected.id}-describedby" class="hidden">{description}</div>
				<div class="{class_prefix}__container">
					<Button
						aria-describedby="{class_prefix}-{selected.id}-describedby"
						aria-label={__( 'Edit or update the image' )}
						class="{class_prefix}__preview"
						on:click={open_frame}><img alt={selected.alt} src={selected.url} /></Button
					>
					<!-- TODO <div class="components-drop-zone" data-is-drop-zone="true" /> -->
				</div>
				<Button is_secondary on:click={open_frame}>{__( 'Replace Image' )}</Button>
				<Button is_destructive is_link on:click={() => set( 0 )}>{remove_label}</Button>
			{:else}
				<p>{__( 'Loading image…', 'catatan' )}</p>
			{/if}
		{:else}
			<Button class="{class_prefix}__toggle" on:click={open_frame}>{set_label}</Button>
		{/if}
	</div>
</Panel>

<style>
	p {
		text-align: center;
	}
</style>
