<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { setContext } from 'svelte';
	import ContentArea from './content-area.svelte';
	import Header from './header.svelte';
	import Notices from './notices.svelte';
	import Sidebar from './sidebar.svelte';
	import type { EditorStore } from '$lib/stores/editor';
	import type { NoticesStore } from '$lib/stores/notices';
	import type { PostStore } from '$lib/stores/post';
	import type { PostTypeStore } from '$lib/stores/post-type';
	import ui from '$lib/stores/ui';

	export let editor_store: EditorStore;
	export let notices_store: NoticesStore;
	export let post_store: PostStore;
	export let post_type_store: PostTypeStore;

	setContext( 'editor', editor_store );
	setContext( 'notices', notices_store );
	setContext( 'post', post_store );
	setContext( 'post_type', post_type_store );
</script>

<div class="block-editor">
	<h1 class="screen-reader-text">{$post_type_store.labels.edit_item}</h1>
	<div class="block-editor__container">
		<div class="edit-post-layout interface-interface-skeleton" class:is-sidebar-opened={$ui.is_sidebar_open}>
			<div class="interface-interface-skeleton__editor">
				<Header />
				<div class="interface-interface-skeleton__body">
					<div
						aria-label={__( 'Editor content' )}
						class="interface-interface-skeleton__content"
						role="region"
						tabindex="-1"
					>
						<Notices />
						<div class="edit-post-visual-editor">
							<ContentArea />
						</div>
					</div>
					<Sidebar />
				</div>
			</div>
		</div>
	</div>
</div>
