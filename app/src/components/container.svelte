<script lang="ts">
	import Editor from './editor.svelte';
	import EditorMenu from './editor-menu.svelte';
	import Header from './header.svelte';
	import Notices from './notices.svelte';
	import Sidebar from './sidebar.svelte';
	import TitleInput from './title-input.svelte';
	import { get_store } from '$stores';
	import { __ } from '@wordpress/i18n';

	const editor = get_store( 'editor' );
	const post_type = get_store( 'post_type' );
	const ui = get_store( 'ui' );

	$: with_editor = $post_type.supports.editor === true;
	$: with_title = $post_type.supports.title === true;
</script>

<div class="block-editor">
	<h1 class="screen-reader-text">{$post_type.labels.edit_item}</h1>
	<div class="block-editor__container">
		<div class="edit-post-layout interface-interface-skeleton" class:is-sidebar-opened={$ui.is_sidebar_open}>
			<div class="interface-interface-skeleton__editor">
				<Header />
				<div class="interface-interface-skeleton__body">
					<div aria-label={__( 'Editor content' )} class="interface-interface-skeleton__content" role="region">
						<Notices />
						{#if with_editor && $editor.editor}
							<EditorMenu />
						{/if}
						<div class="edit-post-visual-editor">
							<div class="edit-post-visual-editor__content-area">
								<div class="is-desktop-preview">
									<div class="editor-styles-wrapper block-editor-writing-flow">
										{#if with_title}
											<TitleInput />
										{/if}
										{#if with_editor}
											<Editor />
										{/if}
									</div>
								</div>
							</div>
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
	}

	/* TODO: Center this thing? */
	.edit-post-visual-editor {
		background-color: inherit;
		max-width: 720px;
		width: 100%;
		/* stylelint-disable-next-line custom-property-pattern */
		padding-inline: var( --wp--custom--spacing--outer );
	}

	/* TODO: Make this toggleable via the "Preview" button. */
	.is-desktop-preview {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		margin: 0;
		display: flex;
		flex-flow: column nowrap;
	}

	.editor-styles-wrapper {
		flex: 1 1 0%;
		max-width: 100%;
		padding-block-end: 40vh;
		display: grid;
		grid-template-rows: auto 1fr;
	}
</style>
