<script lang="ts">
	import { getContext } from 'svelte';
	import Editor from './editor.svelte';
	import Header from './header.svelte';
	import Notices from './notices.svelte';
	import Sidebar from './sidebar.svelte';
	import TitleInput from './title-input.svelte';
	import type { Config } from '$types';
	import ui from '$lib/stores/ui';

	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );
</script>

<div class="block-editor__container">
	<div class="edit-post-layout interface-interface-skeleton" class:is-sidebar-opened={$ui.is_sidebar_open}>
		<div class="interface-interface-skeleton__editor">
			<Header />
			<div class="interface-interface-skeleton__body">
				<Notices />
				<div
					class="interface-interface-skeleton__content"
					role="region"
					aria-label={l10n.content_region_title}
					tabindex="-1"
				>
					<div class="edit-post-visual-editor">
						<div class="edit-post-visual-editor__content-area">
							<div class="is-desktop-preview">
								<div class="editor-styles-wrapper block-editor-writing-flow">
									<TitleInput />
									<Editor />
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

<style>
	.is-desktop-preview {
		height: 100%;
		width: 100%;
		margin: 0;
		display: flex;
		flex-flow: column nowrap;
		background: white none repeat scroll 0% 0%;
	}
</style>
