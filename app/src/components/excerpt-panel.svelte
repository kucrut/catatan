<script lang="ts">
	import BaseControl from './base-control.svelte';
	import ExternalLink from './external-link.svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';
	import TextareaControl from './textarea-control.svelte';

	const editor = get_store( 'editor' );
	const id = 'catatan-post-excerpt-input';

	function handle_input( event: InputEvent & { currentTarget: HTMLTextAreaElement } ): void {
		editor.update( { excerpt: event.currentTarget.value } );
	}
</script>

<Panel id="excerpt" title={__( 'Excerpt' )}>
	<PanelRow class="editor-post-excerpt">
		<TextareaControl
			{id}
			label={__( 'Write an excerpt (optional)' )}
			value={$editor.data.excerpt || ''}
			on:input={handle_input}
		/>
		<ExternalLink href="https://wordpress.org/support/article/settings-sidebar/#excerpt"
			>{__( 'Learn more about manual excerpts' )}</ExternalLink
		>
	</PanelRow>
</Panel>
