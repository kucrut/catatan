<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import ContentArea from './content-area.svelte';
	import Header from './header.svelte';
	import Notices from './notices.svelte';
	import Sidebar from './sidebar.svelte';
	import { get_store } from '$stores';

	const post_type = get_store( 'post_type' );
	const ui = get_store( 'ui' );

	const { labels, supports } = $post_type;
</script>

<div class="block-editor">
	<h1 class="screen-reader-text">{labels.edit_item}</h1>
	<div class="block-editor__container">
		<div class="edit-post-layout interface-interface-skeleton" class:is-sidebar-opened={$ui.is_sidebar_open}>
			<div class="interface-interface-skeleton__editor">
				<Header />
				<div class="interface-interface-skeleton__body">
					<div aria-label={__( 'Editor content' )} class="interface-interface-skeleton__content" role="region">
						<Notices />
						<div class="edit-post-visual-editor">
							<ContentArea with_editor={supports.editor === true} with_title={supports.title === true} />
						</div>
					</div>
					<Sidebar />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.interface-interface-skeleton__content {
		background-color: #fff;
		width: 100%;
		padding-inline: var( --wp--custom--spacing--outer );
	}

	/* TODO: Center this thing */
	.edit-post-visual-editor {
		max-width: 720px;
	}
</style>
