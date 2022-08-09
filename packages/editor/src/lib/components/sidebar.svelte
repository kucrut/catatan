<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import ExcerptPanel from './excerpt-panel.svelte';
	import PermalinkPanel from './permalink-panel.svelte';
	import type { PostTypeStore } from '$lib/stores/post-type';
	import ui from '$lib/stores/ui';

	const post_type = getContext< PostTypeStore >( 'post_type' );
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
			<Button
				aria-label={__( 'Close settings' )}
				icon="close"
				on:click={() => {
					ui.close_sidebar();
				}}
			/>
		</div>
		<!-- <StatusPanel /> -->
		<PermalinkPanel />
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
