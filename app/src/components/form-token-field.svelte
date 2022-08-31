<script lang="ts">
	import { click_outside } from '$actions/click-outside';
	import { onDestroy, onMount } from 'svelte';

	export let id: string;
	export let label: string;
	export let help = '';
	export let value: string;

	const class_prefix = 'components-form-token';
	let has_focus = false;
	let input_el: HTMLInputElement;

	function handle_focus_input() {
		has_focus = true;
	}

	function handle_click_outside() {
		has_focus = false;
	}

	onMount( () => {
		// We're attaching it here so we don't occupy the input's focus event.
		input_el.addEventListener( 'focus', handle_focus_input );
	} );

	onDestroy( () => {
		input_el.removeEventListener( 'focus', handle_focus_input );
	} );
</script>

<div class="{class_prefix}-field">
	<label for="{class_prefix}-input-{id}" class="{class_prefix}-field__label">{label}</label>
	<div
		class="{class_prefix}-field__input-container"
		tabindex="-1"
		class:is-active={has_focus}
		on:click={() => input_el.focus()}
		use:click_outside={{ active: has_focus, callback: handle_click_outside }}
	>
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
			on:blur
			on:change
			on:focus
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
