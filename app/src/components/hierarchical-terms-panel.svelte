<script lang="ts">
	import type { SelectControlOption } from '$types';
	import type { Taxonomy } from '$stores/taxonomies';
	import type { NewTerm, TermsStore, TermWithChildren } from '$stores/terms';
	import Button from './button.svelte';
	import HierarchicalTermsChoice from './hierarchical-terms-choice.svelte';
	import Panel from './panel.svelte';
	import SelectControl from './select-control.svelte';
	import TextControl from './text-control.svelte';
	import { get_store } from '$stores';
	import { onMount } from 'svelte';
	import { sprintf, __ } from '@wordpress/i18n';
	import { filter_choices, term_to_option } from '$utils/terms';

	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const editor = get_store( 'editor' );
	const notices = get_store( 'notices' );
	const class_prefix = 'editor-post-taxonomies__hierarchical-terms';
	let is_creating_term = false;
	let is_create_button_disabled = true;
	let search = '';
	let choices: TermWithChildren[];
	let term_options: SelectControlOption[];

	$: ( { labels, name, rest_base: tax_name, slug, __can__ } = taxonomy );
	$: ( { add_new_item, parent_item, search_items, singular_name, new_item_name } = labels );
	$: panel_id = `taxonomy-panel-${ tax_name }`;
	$: choices = filter_choices( $terms.sorted || [], search );
	$: term_options = create_options();

	function create_options(): SelectControlOption[] {
		if ( ! $terms.sorted.length ) {
			return [];
		}

		return [
			{ label: `— ${ parent_item } —`, value: '' },
			...$terms.sorted.reduce( ( prev, current ) => term_to_option( 0, prev, current ), [] ),
		];
	}

	function handle_click_toggle(): void {
		is_creating_term = ! is_creating_term;
	}

	function handle_change_new_term_name( event: Event & { target: HTMLInputElement } ): void {
		is_create_button_disabled = event.target.value === '';
	}

	async function handle_create_new_term( event: SubmitEvent ): Promise< void > {
		const form = event.target as HTMLFormElement;
		const data = new FormData( form );
		const params: NewTerm = { name: '' };
		const term_name = data.get( 'name' ) as string;
		const term_parent = data.get( 'parent' ) as string;

		if ( ! term_name ) {
			return;
		}

		params.name = term_name;

		if ( term_parent ) {
			params.parent = Number( term_parent );
		}

		try {
			const { id } = await terms.create( params );

			editor.add_term( tax_name, id );
			form.reset();
		} catch ( error ) {
			notices.add( {
				content: sprintf( __( `Create %s error: %s.` ), singular_name.toLocaleLowerCase(), error.message ),
				dismissible: true,
				id: `create-${ name }-error`,
				type: 'error',
			} );
		}
	}

	function handle_search_input( event: Event & { target: HTMLInputElement } ): void {
		search = event.target.value;
	}

	onMount( () => {
		terms.fetch( { page: 1 }, true );
	} );
</script>

<Panel id={panel_id} title={name}>
	{#if $terms.flat.length > 10}
		<TextControl
			autocomplete="off"
			class="{class_prefix}-filter"
			id="{panel_id}-filter"
			label={search_items}
			value={search}
			on:input={handle_search_input}
		/>
	{/if}
	<div class="{class_prefix}-list">
		<HierarchicalTermsChoice {class_prefix} {taxonomy} terms={choices} />
	</div>
	{#if __can__.create}
		<Button is_link aria-expanded={is_creating_term} class="{class_prefix}-add" on:click={handle_click_toggle}
			>{add_new_item}</Button
		>
		{#if is_creating_term}
			<form on:submit|preventDefault={handle_create_new_term}>
				<TextControl
					autocomplete="off"
					class="{class_prefix}-input"
					id="{class_prefix}-{slug}-input"
					label={new_item_name}
					name="name"
					on:input={handle_change_new_term_name}
				/>
				{#if term_options.length}
					<SelectControl
						id="{class_prefix}-{slug}-parent"
						label={parent_item}
						name="parent"
						options={term_options}
						value={term_options[ 0 ].value}
					/>
				{/if}
				<Button is_secondary class="{class_prefix}-submit" disabled={is_create_button_disabled}>{add_new_item}</Button>
			</form>
		{/if}
	{/if}
</Panel>
