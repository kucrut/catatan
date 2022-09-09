<script lang="ts">
	import BaseControlHelp from './base-control-help.svelte';
	import ExternalLink from './external-link.svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import TextareaControl from './textarea-control.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

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
		>
			<BaseControlHelp slot="help">
				<ExternalLink href="https://wordpress.org/support/article/settings-sidebar/#excerpt"
					>{__( 'Learn more about manual excerpts' )}</ExternalLink
				>
			</BaseControlHelp>
		</TextareaControl>
	</PanelRow>
</Panel>
