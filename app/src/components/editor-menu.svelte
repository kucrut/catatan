<script lang="ts">
	import Button from '$components/button.svelte';
	import LinkControl from './link-control.svelte';
	import { __ } from '@wordpress/i18n';
	import { class_names } from '$utils/css';
	import { get_store } from '$stores';

	const blocks = get_store( 'blocks' );
	const active_class = 'is-pressed';

	$: is_active = ( key: string ) => $blocks.editor.isActive( key );
	$: button_class = ( key: string ) => class_names( is_active( key ) ? active_class : '', 'components-toolbar-button' );
	$: run = ( task: string ) => () => $blocks.editor.chain().focus()[ task ]().run();
	$: has_no_selection = $blocks.editor.view.state.selection.empty;
	$: is_link_selected = $blocks.editor.isActive( 'link' );

	function handle_click_link() {
		if ( is_link_selected ) {
			$blocks.editor.chain().focus().unsetLink().run();
		} else {
			$blocks.edited_link = '';
		}
	}
</script>

<div
	aria-orientation="horizontal"
	class="components-accessible-toolbar block-editor-block-contextual-toolbar is-fixed"
	role="toolbar"
>
	<div class="block-editor-block-toolbar">
		<div class="components-toolbar-group">
			<Button
				aria-label={__( 'Bold' )}
				class={button_class( 'bold' )}
				icon="bold"
				title={__( 'Bold Ctrl + B' )}
				on:click={run( 'toggleBold' )}
			/>
			<Button
				aria-label={__( 'Italic' )}
				class={button_class( 'italic' )}
				icon="italic"
				title={__( 'Italic Ctrl + I' )}
				on:click={run( 'toggleItalic' )}
			/>
			<Button
				aria-label={__( 'Inline code' )}
				class={button_class( 'code' )}
				icon="code"
				title={__( 'Inline code Ctrl + E' )}
				on:click={run( 'toggleCode' )}
			/>
			<Button
				aria-label={is_link_selected ? __( 'Unlink' ) : __( 'Link' )}
				class={class_names( is_link_selected ? active_class : '', 'components-toolbar-button' )}
				disabled={has_no_selection && ! is_link_selected}
				icon={is_link_selected ? 'unlink' : 'link'}
				title={is_link_selected ? __( 'Unlink' ) : null}
				on:click={handle_click_link}
			/>
			{#if $blocks.edited_link !== null}
				<LinkControl />
			{/if}
		</div>
	</div>
</div>
