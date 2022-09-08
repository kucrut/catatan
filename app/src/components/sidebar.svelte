<script lang="ts">
	import Button from './button.svelte';
	import PostPanel from './post-panel.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	const post_type = get_store( 'post_type' );
	const ui = get_store( 'ui' );
</script>

<div
	aria-label={__( 'Editor settings' )}
	class="interface-interface-skeleton__sidebar"
	class:hidden={! $ui.is_sidebar_open}
	role="region"
>
	<div class="interface-complementary-area edit-post-sidebar">
		<div class="components-panel__header interface-complementary-area-header edit-post-sidebar__panel-tabs">
			<ul>
				<li>
					<Button class="edit-post-sidebar__panel-tab is-active">{$post_type.labels.singular_name}</Button>
					<Button class="edit-post-sidebar__panel-tab">{__( 'Block' )}</Button>
				</li>
			</ul>
			<Button aria-label={__( 'Close settings' )} icon="close" on:click={() => ui.toggle( 'sidebar' )} />
		</div>
		<PostPanel />
	</div>
</div>

<style>
	.interface-interface-skeleton__sidebar.hidden {
		display: none;
	}
</style>
