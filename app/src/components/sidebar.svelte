<script lang="ts">
	import BlockPanel from './block-panel.svelte';
	import Button from './button.svelte';
	import PostPanel from './post-panel.svelte';
	import { __ } from '@wordpress/i18n';
	import { class_names } from '$utils/css';
	import { get_store } from '$stores';

	const post_type = get_store( 'post_type' );
	const ui = get_store( 'ui' );

	const panels = [
		{
			id: 'post',
			label: $post_type.labels.singular_name,
		},
		{
			id: 'block',
			label: __( 'Block' ),
		},
	];

	let active_panel_id = panels[ 0 ].id;
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
				{#each panels as { id, label }, index (index + id)}
					{@const  cls = class_names( active_panel_id === id ? 'is-active' : '', 'edit-post-sidebar__panel-tab' ) }
					<li>
						<Button class={cls} on:click={() => ( active_panel_id = id )}>{label}</Button>
					</li>
				{/each}
			</ul>
			<Button aria-label={__( 'Close settings' )} icon="close" on:click={() => ui.toggle( 'sidebar' )} />
		</div>
		<PostPanel hidden={active_panel_id !== 'post'} />
		<BlockPanel hidden={active_panel_id !== 'block'} />
	</div>
</div>

<style>
	.interface-interface-skeleton__sidebar.hidden {
		display: none;
	}
</style>
