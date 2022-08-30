<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { SlimTerm, TermsStore } from '$stores/terms';
	import type { TokenItem } from '$types';
	import FormTokenField from './form-token-field.svelte';
	import FormTokenFieldToken from './form-token-field-token.svelte';
	import FormTokenFieldSuggestions from './form-token-field-suggestions.svelte';
	import Panel from './panel.svelte';
	import { sprintf, __ } from '@wordpress/i18n';
	import { onMount } from 'svelte';
	import { get_store } from '$stores';
	import { map_id_to_token_item } from '$utils/terms';

	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const editor = get_store( 'editor' );

	const { labels, rest_base: tax_name } = taxonomy;
	const { add_new_item, singular_name } = labels;
	const remove_text = sprintf( __( 'Remove %s' ), singular_name );

	let items: TokenItem[] = [];
	let search_result: SlimTerm[] = [];
	let search_term = '';
	let selected: number[];
	let suggestions: string[] = [];

	$: {
		selected = ( $editor.data[ tax_name ] as typeof selected ) || [];
		items =
			selected?.length && $terms.flat?.length
				? selected.map( ( ...args ) => map_id_to_token_item( $terms.flat, ...args ) ).filter( i => i !== null )
				: [];

		suggestions = search_result.length ? search_result.map( ( { name } ) => name ) : [];
	}

	async function handle_input( event: Event & { target: HTMLInputElement } ): Promise< void > {
		const { value } = event.target;

		search_term = value.length >= 3 ? value : '';
		search_result = search_term ? await terms.search( search_term ) : [];
	}

	onMount( () => {
		if ( selected && selected.length ) {
			terms.fetch( { include: selected } );
		}
	} );
</script>

<Panel title={taxonomy.name}>
	<FormTokenField
		help={__( 'Separate with commas or the Enter key.' )}
		id={tax_name}
		label={add_new_item}
		on:input={handle_input}
	>
		<svelte:fragment slot="before-input">
			{#each items as item (item.id)}
				<FormTokenFieldToken
					{...item}
					button_text={remove_text}
					on:click={() => editor.remove_term( tax_name, Number( item.id ) )}
				/>
			{/each}
		</svelte:fragment>
		<svelte:fragment slot="after-input">
			{#if search_term && suggestions.length}
				<FormTokenFieldSuggestions id={tax_name} items={suggestions} search={search_term} />
			{/if}
		</svelte:fragment>
	</FormTokenField>
</Panel>
