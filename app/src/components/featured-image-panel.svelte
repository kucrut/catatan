<script lang="ts">
	import Panel from './panel.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	const editor = get_store( 'editor' );
	const post_type = get_store( 'post_type' );

	const DEFAULT_SET_LABEL = __( 'Set featured image' );
	const DEFAULT_TITLE = __( 'Featured image' );
	const class_prefix = 'editor-post-featured-image';

	$: set_label = $post_type.labels.set_featured_image || DEFAULT_SET_LABEL;
	$: title = $post_type.labels.featured_image || DEFAULT_TITLE;
</script>

<Panel {title}>
	<div class={class_prefix}>
		{#if ! $editor.data.featured_media}
			<button type="button" class="components-button {class_prefix}__toggle">{set_label}</button>
		{/if}
	</div>
</Panel>
