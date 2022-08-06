<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import type { Config } from '$types';
	import type { DocumentStore } from '$lib/stores/document';
	import ui from '$lib/stores/ui';

	const doc = getContext< DocumentStore >( 'document' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );
</script>

<div class="interface-interface-skeleton__header" role="region" aria-label={l10n.header_title} tabindex="-1">
	<div class="edit-post-header">
		<div class="edit-post-header__toolbar">
			<div
				role="toolbar"
				aria-orientation="horizontal"
				aria-label={l10n.header_toolbar_title}
				class="components-accessible-toolbar edit-post-header-toolbar"
			>
				<div class="edit-post-header-toolbar__left" />
			</div>
		</div>
		<div class="edit-post-header__settings">
			<Button is_tertiary aria-disabled={! $doc.is_dirty} disabled={! $doc.is_dirty}>{l10n.save_draft}</Button>
			<Button is_tertiary>{l10n.preview}</Button>
			<Button is_primary>{l10n.publish}</Button>
			<div class="interface-pinned-items">
				<Button
					aria-pressed={$ui.is_sidebar_open}
					aria-expanded={$ui.is_sidebar_open}
					class={$ui.is_sidebar_open ? 'is-pressed' : ''}
					aria-label={l10n.settings}
					icon="gear"
					on:click={() => ui.toggle_sidebar()}
				/>
			</div>
		</div>
	</div>
</div>
