<script lang="ts">
	import type { Taxonomy } from '$stores/taxonomies';
	import type { TermsStore } from '$stores/terms';
	import type { TokenItem } from '$types';
	import FormTokenField from './form-token-field.svelte';
	import FormTokenFieldToken from './form-token-field-token.svelte';
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

	let selected: number[];
	let items: TokenItem[] = [];

	$: {
		selected = ( $editor.data[ tax_name ] as typeof selected ) || [];
		items =
			selected?.length && $terms.flat?.length
				? selected.map( ( ...args ) => map_id_to_token_item( $terms.flat, ...args ) ).filter( i => i !== null )
				: [];
	}

	onMount( () => {
		if ( selected && selected.length ) {
			terms.fetch( { include: selected } );
		}
	} );
</script>

<Panel title={taxonomy.name}>
	<FormTokenField help={__( 'Separate with commas or the Enter key.' )} id={tax_name} label={add_new_item}>
		<svelte:fragment slot="before-input">
			{#each items as item (item.id)}
				<FormTokenFieldToken
					{...item}
					button_text={remove_text}
					on:click={() => {
						editor.remove_term( tax_name, Number( item.id ) );
					}}
				/>
			{/each}
		</svelte:fragment>
	</FormTokenField>
</Panel>
