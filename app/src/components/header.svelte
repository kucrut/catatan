<script lang="ts">
	import { get_store } from '$stores';
	import { __ } from '@wordpress/i18n';
	import InsertImageButton from './insert-image-button.svelte';
	import PreviewButton from './preview-button.svelte';
	import PublishButton from './publish-button.svelte';
	import SaveButton from './save-button.svelte';
	import ToggleSidebarButton from './toggle-sidebar-button.svelte';

	const post_type = get_store( 'post_type' );
</script>

<div aria-label={__( 'Editor top bar' )} class="interface-interface-skeleton__header" role="region">
	<div class="edit-post-header">
		<div class="edit-post-header__toolbar">
			<div
				aria-label={__( 'Document tools' )}
				aria-orientation="horizontal"
				class="components-accessible-toolbar edit-post-header-toolbar"
				role="toolbar"
			>
				<div class="edit-post-header-toolbar__left">
					<InsertImageButton />
				</div>
			</div>
		</div>
		<div class="edit-post-header__settings">
			<SaveButton />
			{#if $post_type.viewable}
				<PreviewButton />
			{/if}
			<PublishButton />
			<div class="interface-pinned-items">
				<ToggleSidebarButton />
			</div>
		</div>
	</div>
</div>
