<script lang="ts">
	import Button from '$components/button.svelte';
	import { __ } from '@wordpress/i18n';
	import { class_names } from '$utils/css';
	import { get_store } from '$stores';

	const store = get_store( 'editor' );

	$: is_active = ( key: string ) => $store.editor.isActive( key );
	$: button_class = ( key: string ) => class_names( is_active( key ) ? 'is-pressed' : '', 'components-toolbar-button' );
	$: run = ( task: string ) => () => $store.editor.chain().focus()[ task ]().run();
	$: has_no_selection = $store.editor.view.state.selection.empty;
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
			<Button aria-label={__( 'Link' )} class="components-toolbar-button" disabled={has_no_selection} icon="link" />
		</div>
	</div>
</div>
