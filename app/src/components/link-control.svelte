<script lang="ts">
	import type { LinkAttributes } from '$types';
	import BaseControl from './base-control.svelte';
	import Button from './button.svelte';
	import FormToggle from './form-toggle.svelte';
	import VisuallyHidden from './visually-hidden.svelte';
	import { __ } from '@wordpress/i18n';
	import { createEventDispatcher } from 'svelte';

	let initial_value = '';
	export { initial_value as value };

	const dispatch = createEventDispatcher< { submit: LinkAttributes } >();
	const class_prefix = 'block-editor-link-control';
	const input_id = 'block-editor-url-input';

	let should_open_in_new_tab = false;
	let value = initial_value;

	const handle_check = () => ( should_open_in_new_tab = ! should_open_in_new_tab );

	function handle_submit() {
		if ( ! ( value || value.startsWith( '/' ) || value.startsWith( '#' ) ) ) {
			return;
		}

		// TODO: Search posts.

		const attributes: LinkAttributes = { href: value };

		if ( should_open_in_new_tab ) {
			attributes.target = '_blank';
		}

		dispatch( 'submit', attributes );
	}
</script>

<form tabindex="-1" class={class_prefix} on:submit|preventDefault={handle_submit}>
	<div class="{class_prefix}__search-input-wrapper">
		<div class="{class_prefix}__search-input-container">
			<BaseControl class="{class_prefix}__field {class_prefix}__search-input">
				<input
					required
					aria-autocomplete="list"
					aria-expanded="false"
					aria-label="URL"
					aria-owns={input_id}
					class="{input_id}__input"
					name="url"
					placeholder={__( 'Search or type url' )}
					role="combobox"
					type="text"
					bind:value
				/>
			</BaseControl>
			<div class="{class_prefix}__search-actions">
				<Button
					aria-label="Submit"
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
