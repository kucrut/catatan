<script lang="ts">
	import FormTokenFieldSuggestions from './form-token-field-suggestions.svelte';
	import { click_outside } from '$actions/click-outside';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	export let id: string;
	export let label: string;
	export let help = '';
	export let options: string[];
	export let value: string;

	const dispatch = createEventDispatcher< { create: string; select: number } >();

	const class_prefix = 'components-form-token';
	let has_focus = false;
	let input_el: HTMLInputElement;
	let hovered_option_index: number | null = null;

	const handle_click_outside = () => ( has_focus = false );

	const handle_input_focus = () => ( has_focus = true );

	function handle_input_keydown( event: KeyboardEvent ): void {
		if (
			[ 'Comma', 'Enter', 'NumpadEnter' ].includes( event.code ) &&
			hovered_option_index === null &&
			value.length >= 3
		) {
			dispatch( 'create', value.trim().replaceAll( ',', '' ) );
		}
	}

	function handle_option_hover( event: CustomEvent< number | null > ): void {
		hovered_option_index = event.detail;
	}

	function handle_option_select( event: CustomEvent< number > ) {
		hovered_option_index = event.detail;
		dispatch( 'select', hovered_option_index );
	}

	onMount( () => {
		// We're attaching it here so we don't occupy the input's focus event.
		if ( input_el ) {
			input_el.addEventListener( 'focus', handle_input_focus );
			input_el.addEventListener( 'keydown', handle_input_keydown );
		}
	} );

	onDestroy( () => {
		input_el.removeEventListener( 'focus', handle_input_focus );
		input_el.removeEventListener( 'keydown', handle_input_keydown );
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
		{#if value && options.length}
			<FormTokenFieldSuggestions
				{id}
				{input_el}
				items={options}
				search={value}
				on:hover-item={handle_option_hover}
				on:select-item={handle_option_select}
			/>
		{/if}
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
