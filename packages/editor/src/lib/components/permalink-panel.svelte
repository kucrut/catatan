<script lang="ts">
	import { getContext } from 'svelte';
	import BaseControl from './base-control.svelte';
	import ExternalLink from './external-link.svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import type { Config } from '$types';
	import type { EditorStore } from '$lib/stores/editor';

	const id = 'catatan-post-slug-input';
	const editor = getContext< EditorStore >( 'editor' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	function handle_input( event: InputEvent & { currentTarget: HTMLInputElement } ) {
		editor.update( { slug: event.currentTarget.value } );
	}
</script>

<Panel title={l10n.permalink} let:is_expanded>
	<PanelRow {is_expanded}>
		<div class="editor-post-link">
			<BaseControl {id} label={l10n.url_slug}>
				<input
					{id}
					autocomplete="off"
					class="components-text-control__input"
					spellcheck="false"
					type="text"
					value={$editor.data.slug}
					on:input={handle_input}
				/>
			</BaseControl>
			<p>
				The last part of the URL. <ExternalLink href="https://wordpress.org/support/article/settings-sidebar/#permalink"
					>Read about permalinks</ExternalLink
				>
			</p>
		</div>
	</PanelRow>
</Panel>
