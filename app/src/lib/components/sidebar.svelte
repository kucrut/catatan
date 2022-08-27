<script lang="ts">
	import Button from './button.svelte';
	import ExcerptPanel from './excerpt-panel.svelte';
	import PermalinkPanel from './permalink-panel.svelte';
	import StatusPanel from './status-panel.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$lib/stores';

	const post_type = get_store( 'post_type' );
	const ui = get_store( 'ui' );

	function close(): void {
		ui.close_sidebar();
	}
</script>

<div
	aria-label={__( 'Editor settings' )}
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
					<Button class="edit-post-sidebar__panel-tab is-active">{$post_type.labels.singular_name}</Button>
				</li>
			</ul>
			<Button aria-label={__( 'Close settings' )} icon="close" on:click={close} />
		</div>
		<StatusPanel />
		{#if $post_type.viewable}
			<PermalinkPanel />
		{/if}
		{#if $post_type.supports.excerpt}
			<ExcerptPanel />
		{/if}
	</div>
</div>

<style>
	.interface-interface-skeleton__sidebar.hidden {
		display: none;
	}
</style>
