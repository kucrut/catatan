<script lang="ts">
	import { getContext } from 'svelte';
	import ContentArea from './content-area.svelte';
	import Header from './header.svelte';
	import Notices from './notices.svelte';
	import Sidebar from './sidebar.svelte';
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
					aria-label={l10n.content_region_title}
					class="interface-interface-skeleton__content"
					role="region"
					tabindex="-1"
				>
					<div class="edit-post-visual-editor">
						<ContentArea />
					</div>
				</div>
				<Sidebar />
			</div>
		</div>
	</div>
</div>
