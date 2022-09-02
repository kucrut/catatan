<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { TermsStore } from '$stores/terms';
	import type { TokenItem } from '$types';
	import type { WP_REST_API_Term } from 'wp-types';
	import FormTokenField from './form-token-field.svelte';
	import FormTokenFieldToken from './form-token-field-token.svelte';
	import Panel from './panel.svelte';
	import debounce from 'just-debounce-it';
	import { sprintf, __ } from '@wordpress/i18n';
	import { onMount } from 'svelte';
	import { get_store } from '$stores';
	import { map_id_to_token_item } from '$utils/terms';

	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const keys_to_watch = [ 'Comma', 'Enter', 'Escape' ];
	const editor = get_store( 'editor' );

	const { labels, rest_base: tax_name, __can__ } = taxonomy;
	const { add_new_item, singular_name } = labels;
	const remove_text = sprintf( __( 'Remove %s' ), singular_name );

	let input_value = '';
	let search_result: WP_REST_API_Term[] = [];
	let search_term = '';
	let selected: number[] = [];
	let options: string[] = [];
	let token_items: TokenItem[] = [];

	const exclude_selected = ( { id } ) => ! selected.includes( id );

	const do_search = debounce( async () => {
		const result = await terms.search( search_term );
		search_result = result.filter( exclude_selected );
	}, 500 );

	$: {
		selected = ( $editor.data[ tax_name ] as typeof selected ) || [];
		options = search_result.length ? search_result.filter( exclude_selected ).map( ( { name } ) => name ) : [];
		token_items =
			selected.length && $terms.flat?.length
				? selected.map( ( ...args ) => map_id_to_token_item( $terms.flat, ...args ) ).filter( i => i !== null )
				: [];
	}

	function add_to_selected( id: number, term?: WP_REST_API_Term ): void {
		if ( term ) {
			terms.add( term );
		}

		editor.add_term( tax_name, id );

		search_term = '';
		input_value = '';
		search_result = [];
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

	async function handle_keydown( event: KeyboardEvent ): Promise< void > {
		if ( ! __can__.create ) {
			return;
		}

		const { code } = event;

		if ( ! keys_to_watch.includes( code ) ) {
			return;
		}

		if ( code === 'Escape' ) {
			search_result = [];
			return;
		}

		const name = input_value.trim().replaceAll( ',', '' );
		if ( ! name ) {
			return;
		}

		try {
			const new_term = await terms.create( { name } );
			add_to_selected( new_term.id, new_term );
		} catch ( error ) {
			if ( error.code === 'term_exists' ) {
				await terms.fetch( { include: [ ...selected, error.data.term_id ] } );
				add_to_selected( error.data.term_id );
			}
		}
	}

	async function handle_select( event: CustomEvent< number > ) {
		const { detail: index } = event;
		const term = search_result[ index ];

		add_to_selected( term.id, term );
	}

	onMount( () => {
		if ( selected.length ) {
			terms.fetch( { include: selected } );
		}
	} );
</script>

<Panel id="taxonomy-{tax_name}" title={taxonomy.name}>
	<FormTokenField
		{options}
		help={__( 'Separate with commas or the Enter key.' )}
		id={tax_name}
		label={add_new_item}
		value={input_value}
		on:input={handle_input}
		on:select={handle_select}
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
	</FormTokenField>
</Panel>
