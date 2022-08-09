<script lang="ts">
	import { getContext } from 'svelte';
	import BaseControl from './base-control.svelte';
	import ExternalLink from './external-link.svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import type { Config } from '$types';
	import type { EditorStore } from '$lib/stores/editor';

	const id = 'catatan-post-excerpt-input';
	const editor = getContext< EditorStore >( 'editor' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	function handle_input( event: InputEvent & { currentTarget: HTMLTextAreaElement } ) {
		editor.update( { excerpt: event.currentTarget.value } );
	}
</script>

<Panel title={l10n.excerpt} let:is_expanded>
	<PanelRow class="editor-post-excerpt" {is_expanded}>
		<BaseControl {id} label={l10n.write_an_excerpt}>
			<textarea
				{id}
				class="components-textarea-control__input "
				rows="4"
				value={$editor.data.excerpt || ''}
				on:input={handle_input}
			/>
		</BaseControl>
		<ExternalLink href="https://wordpress.org/support/article/settings-sidebar/#excerpt"
			>Learn more about manual excerpts</ExternalLink
		>
	</PanelRow>
</Panel>

<style>
	textarea {
		width: 100%;
	}
</style>
