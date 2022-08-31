<script lang="ts">
	import type { WP_Media } from '$types';
	import Button from './button.svelte';
	import MediaFrame from './media-frame.svelte';
	import Panel from './panel.svelte';
	import { sprintf, __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	interface Media {
		alt: string;
		filename: string;
		id: number;
		url: string;
	}

	const editor = get_store( 'editor' );
	const post_type = get_store( 'post_type' );

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
		const { alt, filename, id, sizes } = event.detail.selection.at( 0 );

		set( id );
		selected = { alt, filename, id, url: sizes.thumbnail?.url || sizes.full.url };
	}

	$: remove_label = $post_type.labels.remove_featured_image || DEFAULT_REMOVE_LABEL;
	$: set_label = $post_type.labels.set_featured_image || DEFAULT_SET_LABEL;
	$: title = $post_type.labels.featured_image || DEFAULT_TITLE;
	$: description = selected
		? selected.alt ||
		  sprintf( __( 'The current image has no alternative text. The file name is: %s' ), selected.filename )
		: '';
</script>

<Panel {title}>
	<div class={class_prefix}>
		{#if is_frame_open}
			<MediaFrame on:close={close_frame} on:select={handle_select} />
		{/if}
		{#if $editor.data.featured_media && selected}
			<div id="{class_prefix}-{selected.id}-describedby" class="hidden">{description}</div>
			<div class="{class_prefix}__container">
				<button
					aria-describedby="{class_prefix}-{selected.id}-describedby"
					aria-label={__( 'Edit or update the image' )}
					class="components-button {class_prefix}__preview"
					type="button"><img alt={selected.alt} src={selected.url} /></button
				>
				<!-- TODO <div class="components-drop-zone" data-is-drop-zone="true" /> -->
			</div>
			<Button is_secondary on:click={open_frame}>{__( 'Replace Image' )}</Button>
			<Button is_destructive is_link on:click={() => set( 0 )}>{remove_label}</Button>
		{:else}
			<Button class="{class_prefix}__toggle" on:click={open_frame}>{set_label}</Button>
		{/if}
	</div>
</Panel>
