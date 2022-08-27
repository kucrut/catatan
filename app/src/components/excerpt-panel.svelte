<script lang="ts">
	import BaseControl from './base-control.svelte';
	import ExternalLink from './external-link.svelte';
	import Panel from './panel.svelte';
	import PanelRow from './panel-row.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';

	const editor = get_store( 'editor' );
	const id = 'catatan-post-excerpt-input';

	function handle_input( event: InputEvent & { currentTarget: HTMLTextAreaElement } ): void {
		editor.update( { excerpt: event.currentTarget.value } );
	}
</script>

<Panel title={__( 'Excerpt' )}>
	<PanelRow class="editor-post-excerpt">
		<BaseControl {id} label={__( 'Write an excerpt (optional)' )}>
			<textarea
				{id}
				class="components-textarea-control__input "
				rows="4"
				value={$editor.data.excerpt || ''}
				on:input={handle_input}
			/>
		</BaseControl>
		<ExternalLink href="https://wordpress.org/support/article/settings-sidebar/#excerpt"
			>{__( 'Learn more about manual excerpts' )}</ExternalLink
		>
	</PanelRow>
</Panel>

<style>
	textarea {
		width: 100%;
	}
</style>
