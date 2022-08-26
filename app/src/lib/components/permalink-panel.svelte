<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { getContext } from 'svelte';
	import BaseControl from './base-control.svelte';
	import ExternalLink from './external-link.svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import type { EditorStore } from '$lib/stores/editor';
	import type { PostTypeStore } from '$lib/stores/post-type';

	const id = 'catatan-post-slug-input';
	const editor = getContext< EditorStore >( 'editor' );
	const post_type = getContext< PostTypeStore >( 'post_type' );

	function handle_input( event: InputEvent & { currentTarget: HTMLInputElement } ) {
		editor.update( { slug: event.currentTarget.value } );
	}
</script>

<Panel title={__( 'Permalink' )}>
	<PanelRow class="editor-post-link">
		<BaseControl {id} label={__( 'URL Slug' )}>
			<input
				{id}
				autocomplete="off"
				class="components-text-control__input"
				spellcheck="false"
				type="text"
				value={$editor.data.slug || ''}
				on:input={handle_input}
			/>
		</BaseControl>
		<p>
			{__( 'The last part of the URL.' )}
			<ExternalLink href="https://wordpress.org/support/article/settings-sidebar/#permalink"
				>{__( 'Read about permalinks' )}</ExternalLink
			>
		</p>
		{#if $editor.data.link}
			<h3 class="edit-post-post-link__preview-label">{$post_type.labels.view_item}</h3>
			<div class="edit-post-post-link__preview-link-container">
				<ExternalLink href={$editor.data.link}>{$editor.data.link}</ExternalLink>
			</div>
		{/if}
	</PanelRow>
</Panel>
