<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import PreviewButton from './preview-button.svelte';
	import PublishButton from './publish-button.svelte';
	import SaveButton from './save-button.svelte';
	import ToggleSidebarButton from './toggle-sidebar-button.svelte';
</script>

<div aria-label={__( 'Editor top bar' )} class="interface-interface-skeleton__header" role="region" tabindex="-1">
	<div class="edit-post-header">
		<div class="edit-post-header__toolbar">
			<div
				aria-label={__( 'Document tools' )}
				aria-orientation="horizontal"
				class="components-accessible-toolbar edit-post-header-toolbar"
				role="toolbar"
			>
				<div class="edit-post-header-toolbar__left" />
			</div>
		</div>
		<div class="edit-post-header__settings">
			<SaveButton />
			<PreviewButton />
			<PublishButton />
			<div class="interface-pinned-items">
				<ToggleSidebarButton />
			</div>
		</div>
	</div>
</div>
