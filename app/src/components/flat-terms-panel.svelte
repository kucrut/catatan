<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { TermsStore } from '$stores/terms';
	import type { WP_REST_API_Term } from 'wp-types';
	import MultiSelect from './multi-select.svelte';
	import Panel from './panel.svelte';
	import debounce from 'just-debounce-it';
	import { sprintf, __ } from '@wordpress/i18n';
	import { onMount } from 'svelte';
	import { get_store } from '$stores';

	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const editor = get_store( 'editor' );

	const { labels, rest_base: tax_name, __can__ } = taxonomy;
	const { add_new_item, singular_name } = labels;
	const remove_selected_text = sprintf( __( 'Remove %s' ), singular_name );

	let options: string[] = [];
	let search_result: WP_REST_API_Term[] = [];
	let search_term = '';
	let selected: number[] = [];
	let value: string[] = [];

	const exclude_selected = ( { id } ) => ! selected.includes( id );

	const do_search = debounce( async () => {
		const result = await terms.search( search_term );
		search_result = result.filter( exclude_selected );
	}, 500 );

	$: {
		selected = [ ...( ( $editor.data[ tax_name ] as typeof selected ) || [] ) ].sort();
		options = search_result.length ? search_result.filter( exclude_selected ).map( ( { name } ) => name ) : [];

		if ( selected.length && $terms.flat?.length ) {
			value = selected
				.map( term_id => $terms.flat.find( ( { id } ) => term_id === id )?.name || null )
				.filter( i => i !== null );
		} else {
			value = [];
		}
	}

	function add_to_selected( id: number, term?: WP_REST_API_Term ): void {
		if ( term ) {
			terms.add( term );
		}

		editor.add_term( tax_name, id );

		search_term = '';
		search_result = [];
	}

	async function handle_input( event: CustomEvent< string > ): Promise< void > {
		search_term = event.detail.length >= 3 ? event.detail : '';

		if ( ! search_term ) {
			search_result = [];
			return;
		}

		do_search();
	}

	async function handle_create( event: CustomEvent< string > ): Promise< void > {
		if ( ! __can__.create ) {
			return;
		}

		try {
			const new_term = await terms.create( { name: event.detail } );
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

	function handle_deselect( event: CustomEvent< number > ): void {
		editor.remove_term( tax_name, selected.at( event.detail ) );
	}

	onMount( () => {
		if ( selected.length ) {
			terms.fetch( { include: selected } );
		}
	} );
</script>

<Panel id="taxonomy-{tax_name}" title={taxonomy.name}>
	<MultiSelect
		{options}
		{remove_selected_text}
		{value}
		help={__( 'Separate with commas or the Enter key.' )}
		id={tax_name}
		label={add_new_item}
		on:create={handle_create}
		on:deselect={handle_deselect}
		on:input={handle_input}
		on:select={handle_select}
	/>
</Panel>
