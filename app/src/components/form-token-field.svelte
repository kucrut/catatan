<script lang="ts">
	export let id: string;
	export let label: string;
	export let help = '';

	const class_prefix = 'components-form-token';
	let is_focused = false;

	function toggle_is_focused() {
		is_focused = ! is_focused;
	}
</script>

<div class="{class_prefix}-field">
	<label for="{class_prefix}-input-{id}" class="{class_prefix}-field__label">{label}</label>
	<div class="{class_prefix}-field__input-container" class:is-active={is_focused}>
		<input
			aria-describedby={help ? `${ class_prefix }-suggestions-howto-${ id }` : null}
			aria-expanded="false"
			autocomplete="off"
			class="{class_prefix}-field__input"
			id="{class_prefix}-input-{id}"
			role="combobox"
			size="5"
			type="text"
			value=""
			on:blur={toggle_is_focused}
			on:focus={toggle_is_focused}
		/>
	</div>
	{#if help}
		<p id="{class_prefix}-suggestions-howto-{id}" class="{class_prefix}-field__help">{help}</p>
	{/if}
</div>
