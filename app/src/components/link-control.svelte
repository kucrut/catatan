<script lang="ts">
	import type { LinkAttributes } from '$types';
	import BaseControl from './base-control.svelte';
	import Button from './button.svelte';
	import Dialog from './dialog.svelte';
	import FormToggle from './form-toggle.svelte';
	import VisuallyHidden from './visually-hidden.svelte';
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';
	import { onMount } from 'svelte';

	const blocks = get_store( 'blocks' );
	const class_prefix = 'block-editor-link-control';
	const input_id = 'block-editor-url-input';

	let input_el: HTMLInputElement;
	let should_open_in_new_tab = false;
	let value = $blocks.edited_link;

	const close = () => ( $blocks.edited_link = null );
	const handle_check = () => ( should_open_in_new_tab = ! should_open_in_new_tab );

	function handle_submit() {
		if ( ! value ) {
			return;
		}

		try {
			new URL( value );
		} catch {
			if ( ! ( value.startsWith( '/' ) || value.startsWith( '#' ) ) ) {
				return;
			}
		}

		// TODO: Search posts.

		const attributes: LinkAttributes = { href: value };

		if ( should_open_in_new_tab ) {
			attributes.target = '_blank';
		}

		$blocks.editor.chain().focus().setLink( attributes ).run();
		close();
	}

	onMount( () => {
		input_el.focus();
	} );
</script>

<Dialog is_anchored open on:close={close} on:escape={close}>
	<form class={class_prefix} on:submit|preventDefault={handle_submit}>
		<div class="{class_prefix}__search-input-wrapper">
			<div class="{class_prefix}__search-input-container">
				<BaseControl class="{class_prefix}__field {class_prefix}__search-input">
					<input
						aria-label={__( 'URL' )}
						class="{input_id}__input"
						placeholder={__( 'Search or type url' )}
						type="text"
						bind:this={input_el}
						bind:value
					/>
				</BaseControl>
				<div class="{class_prefix}__search-actions">
					<Button
						aria-label={__( 'Submit' )}
						class="{class_prefix}__search-submit"
						disabled={value === ''}
						icon="return"
						type="submit"
					/>
				</div>
			</div>
		</div>
		<div class="{class_prefix}__tools">
			<fieldset class="{class_prefix}__settings">
				<VisuallyHidden>{__( 'Currently selected link settings' )}</VisuallyHidden>
				<FormToggle
					checked={should_open_in_new_tab}
					class="{class_prefix}__setting"
					id={input_id}
					label={__( 'Open in new tab' )}
					on:click={handle_check}
				/>
			</fieldset>
		</div>
	</form>
</Dialog>
