<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import Button from './button.svelte';
	import PreviewButton from './preview-button.svelte';
	import PublishButton from './publish-button.svelte';
	import SaveButton from './save-button.svelte';
	import ui from '$lib/stores/ui';
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
				<Button
					aria-expanded={$ui.is_sidebar_open}
					aria-label={__( 'Settings' )}
					aria-pressed={$ui.is_sidebar_open}
					class={$ui.is_sidebar_open ? 'is-pressed' : ''}
					icon="gear"
					on:click={() => ui.toggle_sidebar()}
				/>
			</div>
		</div>
	</div>
</div>
