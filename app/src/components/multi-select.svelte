<script lang="ts">
	import MultiSelectSuggestions from './multi-select-suggestions.svelte';
	import MultiSelectToken from './multi-select-token.svelte';
	import { click_outside } from '$actions/click-outside';
	import { createEventDispatcher, tick } from 'svelte';
	import { sprintf, __ } from '@wordpress/i18n';
	import type { InputKeyboardEvent } from '$types';

	export let class_prefix = 'components-form-token-field';
	export let id: string;
	export let label: string;
	export let help = '';
	export let options: string[] = [];
	export let remove_selected_text: string;
	export let value: string[] = [];

	const dispatch = createEventDispatcher< {
		create: string;
		deselect: number;
		input: string;
		select: number;
	} >();

	const create_keys = new Set( [ 'Comma', 'Enter', 'NumpadEnter' ] );
	const select_keys = new Set( [ 'ArrowDown', 'ArrowUp' ] );
	const suggestion_keys = new Set( [ ...select_keys, 'Enter', 'Escape' ] );

	let options_backup: typeof options = [];
	let has_focus = false;
	let hovered_option_index: number | null = null;
	let input_el: HTMLInputElement;

	$: token_items = value.map( ( term_name, index, arr ) => ( {
		id: index,
		label: term_name,
		description: sprintf( __( '%s (%d of %d)' ), term_name, index, arr.length ),
	} ) );

	const handle_click_outside = () => ( has_focus = false );

	const handle_input_focus = () => ( has_focus = true );

	function handle_input_change( event: InputKeyboardEvent ): void {
		dispatch( 'input', event.currentTarget.value );
	}

	async function handle_input_keydown( event: InputKeyboardEvent ): Promise< void > {
		const { code: key } = event;

		if ( key === 'Backspace' ) {
			const selected_total = value.length;

			if ( ! input_el.value && selected_total ) {
				dispatch( 'deselect', selected_total - 1 );
			}

			return;
		}

		if ( ! suggestion_keys.has( key ) ) {
			return;
		}

		const backup_total = options_backup.length;
		const options_total = options.length;

		if ( ! ( options_total || backup_total ) ) {
			return;
		}

		// Default behaviour is prevented so the cursor doesn't jump around.
		event.preventDefault();

		// Pressing up or down arrow key, and we have a backup of the options, let's re-use it.
		if ( select_keys.has( key ) && backup_total ) {
			options = [ ...options_backup ];
			options_backup = [];
			return;
		}

		await tick();

		switch ( key ) {
			case 'ArrowDown':
				hovered_option_index =
					hovered_option_index === null || hovered_option_index + 1 === options_total ? 0 : hovered_option_index + 1;
				break;

			case 'ArrowUp':
				hovered_option_index =
					hovered_option_index === null || hovered_option_index === 0 ? options_total - 1 : hovered_option_index - 1;
				break;

			case 'Enter':
				if ( hovered_option_index !== null ) {
					select_option( hovered_option_index );
				}
				break;

			default: // Escape.
				options_backup = [ ...options ];
				options = [];
				break;
		}
	}

	function handle_input_keyup( event: InputKeyboardEvent ): void {
		const { code: key, currentTarget: el } = event;

		if ( create_keys.has( key ) && hovered_option_index === null && el.value.length >= 3 ) {
			const new_token_index = token_items.length;
			const new_token_label = el.value.trim().replaceAll( ',', '' );
			const new_token_desc = sprintf( __( '%s (%d of %d)' ), new_token_label, new_token_index, new_token_index + 1 );

			dispatch( 'create', new_token_label );

			// Temporarily add the new token to the collection to make the UI snappy.
			token_items = [
				...token_items,
				{
					description: new_token_desc,
					id: new_token_index,
					label: new_token_label,
				},
			];
			el.value = '';
		}
	}

	function handle_option_hover( event: CustomEvent< number | null > ): void {
		hovered_option_index = event.detail;
	}

	function handle_option_select( event: CustomEvent< number > ) {
		hovered_option_index = event.detail;
		select_option( hovered_option_index );
	}

	function select_option( index: number ) {
		hovered_option_index = null;
		input_el.value = '';
		dispatch( 'select', index );
	}
</script>

<div class={class_prefix}>
	<label for="{class_prefix}-input-{id}" class="{class_prefix}__label">{label}</label>
	<div
		class="{class_prefix}__input-container"
		tabindex="-1"
		class:is-active={has_focus}
		on:click={() => input_el.focus()}
		use:click_outside={{ active: has_focus, callback: handle_click_outside }}
	>
		{#if token_items.length}
			{#each token_items as item, index (`${ index }${ item.label }`)}
				<MultiSelectToken
					{...item}
					{class_prefix}
					remove_text={remove_selected_text}
					on:click={() => dispatch( 'deselect', index )}
				/>
			{/each}
		{/if}
		<input
			aria-describedby={help ? `${ class_prefix }-suggestions-howto-${ id }` : null}
			aria-expanded="false"
			autocomplete="off"
			class="{class_prefix}__input"
			id="{class_prefix}-input-{id}"
			role="combobox"
			size="5"
			type="text"
			bind:this={input_el}
			on:focus={handle_input_focus}
			on:input={handle_input_change}
			on:keydown={handle_input_keydown}
			on:keyup={handle_input_keyup}
		/>
		{#if input_el?.value && options.length}
			<MultiSelectSuggestions
				{class_prefix}
				{id}
				items={options}
				search={input_el.value}
				selected_index={hovered_option_index}
				on:hover-item={handle_option_hover}
				on:select-item={handle_option_select}
			/>
		{/if}
	</div>
	{#if help}
		<p id="{class_prefix}-suggestions-howto-{id}" class="{class_prefix}__help">{help}</p>
	{/if}
</div>

<style>
	input {
		margin-block-start: 1px;
		margin-block-end: 1px;
	}
</style>
