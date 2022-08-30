<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { SlimTerm, TermsStore } from '$stores/terms';
	import type { TokenItem } from '$types';
	import FormTokenField from './form-token-field.svelte';
	import FormTokenFieldToken from './form-token-field-token.svelte';
	import FormTokenFieldSuggestions from './form-token-field-suggestions.svelte';
	import Panel from './panel.svelte';
	import debounce from 'just-debounce-it';
	import { sprintf, __ } from '@wordpress/i18n';
	import { onMount, tick } from 'svelte';
	import { get_store } from '$stores';
	import { map_id_to_token_item } from '$utils/terms';

	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const editor = get_store( 'editor' );

	const { labels, rest_base: tax_name } = taxonomy;
	const { add_new_item, singular_name } = labels;
	const remove_text = sprintf( __( 'Remove %s' ), singular_name );

	let input_value = '';
	let search_result: SlimTerm[] = [];
	let search_term = '';
	let selected: number[] = [];
	let suggestions: string[] = [];
	let token_items: TokenItem[] = [];

	const exclude_selected = ( { id } ) => ! selected.includes( id );

	const do_search = debounce( async () => {
		const result = await terms.search( search_term );
		search_result = result.filter( exclude_selected );
	}, 500 );

	$: {
		selected = ( $editor.data[ tax_name ] as typeof selected ) || [];
		suggestions = search_result.length ? search_result.filter( exclude_selected ).map( ( { name } ) => name ) : [];
		token_items =
			selected.length && $terms.flat?.length
				? selected.map( ( ...args ) => map_id_to_token_item( $terms.flat, ...args ) ).filter( i => i !== null )
				: [];
	}

	async function handle_input( event: Event & { target: HTMLInputElement } ): Promise< void > {
		const { value } = event.target;

		input_value = value;
		search_term = value.length >= 3 ? value : '';

		if ( ! search_term ) {
			search_result = [];
			return;
		}

		do_search();
	}

	async function handle_select( event: CustomEvent< number > ) {
		const { detail: index } = event;
		const { id } = search_result[ index ];

		editor.add_term( tax_name, id );
		// Wait until `selected` is updated before clearing the result.
		await tick();
		search_result = [];
		// Wait until the terms store is refreshed before clearing everything else
		// so that we can erase the input value and insert the new token (almost) at the same time.
		await terms.fetch( { include: selected } );
		search_term = '';
		input_value = '';
	}

	onMount( () => {
		if ( selected.length ) {
			terms.fetch( { include: selected } );
		}
	} );
</script>

<Panel title={taxonomy.name}>
	<FormTokenField
		help={__( 'Separate with commas or the Enter key.' )}
		id={tax_name}
		label={add_new_item}
		value={input_value}
		on:input={handle_input}
	>
		<svelte:fragment slot="before-input">
			{#each token_items as item (item.id)}
				<FormTokenFieldToken
					{...item}
					button_text={remove_text}
					on:click={() => editor.remove_term( tax_name, Number( item.id ) )}
				/>
			{/each}
		</svelte:fragment>
		<svelte:fragment slot="after-input">
			{#if search_term && suggestions.length}
				<FormTokenFieldSuggestions id={tax_name} items={suggestions} search={search_term} on:select={handle_select} />
			{/if}
		</svelte:fragment>
	</FormTokenField>
</Panel>
