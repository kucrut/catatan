<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import PermalinkPanel from './permalink-panel.svelte';
	import type { Config } from '$types';
	import ui from '$lib/stores/ui';

	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );
</script>

<div
	aria-label={l10n.sidebar_title}
	class="interface-interface-skeleton__sidebar"
	class:hidden={! $ui.is_sidebar_open}
	role="region"
	tabindex="-1"
>
	<div class="interface-complementary-area edit-post-sidebar">
		<div
			class="components-panel__header interface-complementary-area-header edit-post-sidebar__panel-tabs"
			tabindex="-1"
		>
			<ul>
				<li>
					<Button class="edit-post-sidebar__panel-tab is-active">{l10n.document}</Button>
				</li>
			</ul>
			<Button
				aria-label={l10n.close_settings}
				icon="close"
				on:click={() => {
					ui.close_sidebar();
				}}
			/>
		</div>
		<!-- <StatusPanel /> -->
		<PermalinkPanel />
	</div>
</div>

<style>
	.interface-interface-skeleton__sidebar.hidden {
		display: none;
	}
</style>
