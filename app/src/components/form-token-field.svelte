<script lang="ts">
	import FormTokenFieldSuggestions from './form-token-field-suggestions.svelte';
	import { click_outside } from '$actions/click-outside';
	import { createEventDispatcher } from 'svelte';

	export let id: string;
	export let label: string;
	export let help = '';
	export let options: string[];

	const dispatch = createEventDispatcher< { create: string; input: string; select: number } >();

	const class_prefix = 'components-form-token';
	const create_keys = [ 'Comma', 'Enter', 'NumpadEnter' ];

	let has_focus = false;
	let hovered_option_index: number | null = null;
	let input_el: HTMLInputElement;

	$: all_options = [ ...options ];

	const handle_click_outside = () => ( has_focus = false );

	const handle_input_focus = () => ( has_focus = true );

	function handle_input_change( event: Event & { currentTarget: EventTarget & HTMLInputElement } ): void {
		dispatch( 'input', event.currentTarget.value );
	}

	function handle_input_keyup( event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement } ): void {
		const { code: key, currentTarget: el } = event;
		const { value } = el;

		if ( create_keys.includes( key ) && hovered_option_index === null && value.length >= 3 ) {
			dispatch( 'create', value.trim().replaceAll( ',', '' ) );
			el.value = '';
		}
	}

	function handle_option_hover( event: CustomEvent< number | null > ): void {
		hovered_option_index = event.detail;
	}

	function handle_option_select( event: CustomEvent< number > ) {
		input_el.value = '';
		hovered_option_index = event.detail;
		dispatch( 'select', hovered_option_index );
	}
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
			aria-describedby={help ? `${ class_prefix }-suggestions-howto-${ id }` : null}
			aria-expanded="false"
			autocomplete="off"
			class="{class_prefix}-field__input"
			id="{class_prefix}-input-{id}"
			role="combobox"
			size="5"
			type="text"
			bind:this={input_el}
			on:focus={handle_input_focus}
			on:input={handle_input_change}
			on:keyup={handle_input_keyup}
		/>
		{#if input_el?.value && all_options.length}
			<FormTokenFieldSuggestions
				{id}
				{input_el}
				items={all_options}
				search={input_el.value}
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
