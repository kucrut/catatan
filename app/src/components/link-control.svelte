<script lang="ts">
	import BaseControl from './base-control.svelte';
	import Button from './button.svelte';
	import FormToggle from './form-toggle.svelte';
	import VisuallyHidden from './visually-hidden.svelte';
	import { __ } from '@wordpress/i18n';

	const class_prefix = 'block-editor-link-control';
	const input_id = 'block-editor-url-input';

	let is_checked = true;

	const handle_check = () => ( is_checked = ! is_checked );
</script>

<div tabindex="-1" class={class_prefix}>
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
					placeholder="Search or type url"
					role="combobox"
					type="text"
					value=""
				/>
			</BaseControl>
			<div class="{class_prefix}__search-actions">
				<Button disabled aria-label="Submit" class="{class_prefix}__search-submit" icon="return" />
			</div>
		</div>
	</div>
	<div class="{class_prefix}__tools">
		<fieldset class="{class_prefix}__settings">
			<VisuallyHidden>{__( 'Currently selected link settings' )}</VisuallyHidden>
			<FormToggle
				checked={is_checked}
				class="{class_prefix}__setting"
				id={input_id}
				label="Open in new tab"
				on:click={handle_check}
			/>
		</fieldset>
	</div>
</div>
