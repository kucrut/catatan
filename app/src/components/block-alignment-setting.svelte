<script lang="ts">
	import Button from './button.svelte';
	import ButtonGroup from './button-group.svelte';
	import { get_store } from '$stores';
	import { __ } from '@wordpress/i18n';

	export let type: string;

	const blocks = get_store( 'blocks' );
	$: alignment_options = Object.entries( $blocks.block_alignments ).map( ( [ id, label ] ) => ( { id, label } ) );

	function handle_alignment_change( event: CustomEvent< string > ) {
		$blocks.editor.commands.setWpAlignment( event.detail );
	}
</script>

<div class="block-editor-image-size-control">
	<div class="block-editor-image-size-control__row">
		<ButtonGroup
			items={alignment_options}
			label={__( 'Alignment' )}
			value={$blocks.editor.getAttributes( type ).wpAlignment}
			on:select={handle_alignment_change}
		/>
		<Button class="is-small" on:click={() => $blocks.editor.commands.unsetWpAlignment()}>{__( 'Reset' )}</Button>
	</div>
</div>
