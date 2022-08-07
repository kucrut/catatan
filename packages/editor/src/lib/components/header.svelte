<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import PreviewButton from './preview-button.svelte';
	import PublishButton from './publish-button.svelte';
	import SaveButton from './save-button.svelte';
	import type { Config } from '$types';
	import ui from '$lib/stores/ui';

	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );
</script>

<div aria-label={l10n.header_title} class="interface-interface-skeleton__header" role="region" tabindex="-1">
	<div class="edit-post-header">
		<div class="edit-post-header__toolbar">
			<div
				aria-label={l10n.header_toolbar_title}
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
					aria-label={l10n.settings}
					aria-pressed={$ui.is_sidebar_open}
					class={$ui.is_sidebar_open ? 'is-pressed' : ''}
					icon="gear"
					on:click={() => ui.toggle_sidebar()}
				/>
			</div>
		</div>
	</div>
</div>
