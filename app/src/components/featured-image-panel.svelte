<script lang="ts">
	import MediaFrame from './media-frame.svelte';
	import Panel from './panel.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	const editor = get_store( 'editor' );
	const post_type = get_store( 'post_type' );

	const DEFAULT_SET_LABEL = __( 'Set featured image' );
	const DEFAULT_TITLE = __( 'Featured image' );
	const class_prefix = 'editor-post-featured-image';

	let is_frame_open = false;

	const close_frame = () => ( is_frame_open = false );
	const open_frame = () => ( is_frame_open = true );

	function handle_select( event: CustomEvent< { selection: object[] } > ): void {
		editor.update( { featured_media: event.detail.selection[ 0 ].id } );
	}

	$: set_label = $post_type.labels.set_featured_image || DEFAULT_SET_LABEL;
	$: title = $post_type.labels.featured_image || DEFAULT_TITLE;
</script>

<Panel {title}>
	<div class={class_prefix}>
		{#if ! $editor.data.featured_media}
			<button class="components-button {class_prefix}__toggle" type="button" on:click={open_frame}>{set_label}</button>
		{/if}
		{#if is_frame_open}
			<MediaFrame on:close={close_frame} on:select={handle_select} />
		{/if}
	</div>
</Panel>
