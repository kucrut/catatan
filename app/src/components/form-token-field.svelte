<script lang="ts">
	export let id: string;
	export let label: string;
	export let help = '';
	export let value: string;

	const class_prefix = 'components-form-token';
	let is_focused = false;
	let input_el: HTMLInputElement;

	function toggle_is_focused() {
		is_focused = ! is_focused;
	}
</script>

<div class="{class_prefix}-field" on:click={() => input_el.focus()}>
	<label for="{class_prefix}-input-{id}" class="{class_prefix}-field__label">{label}</label>
	<div class="{class_prefix}-field__input-container" class:is-active={is_focused}>
		<slot name="before-input" {input_el} />
		<input
			{value}
			aria-describedby={help ? `${ class_prefix }-suggestions-howto-${ id }` : null}
			aria-expanded="false"
			autocomplete="off"
			class="{class_prefix}-field__input"
			id="{class_prefix}-input-{id}"
			role="combobox"
			size="5"
			type="text"
			bind:this={input_el}
			on:blur={toggle_is_focused}
			on:focus={toggle_is_focused}
			on:change
			on:input
			on:keydown
			on:keyup
		/>
		<slot name="after-input" {input_el} />
	</div>
	{#if help}
		<p id="{class_prefix}-suggestions-howto-{id}" class="{class_prefix}-field__help">{help}</p>
	{/if}
</div>

<style>
	input {
		margin-block-start: 1px;
		margin-block-end: 1px;
	}
</style>
