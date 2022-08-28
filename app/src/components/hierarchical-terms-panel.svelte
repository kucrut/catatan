<script lang="ts">
	import type { SelectControlOption } from '$types';
	import type { Taxonomy } from '$stores/taxonomies';
	import type { NewTerm, TermsStore, TermWithChildren } from '$stores/terms';
	import HierarchicalTermsChoice from './hierarchical-terms-choice.svelte';
	import Panel from './panel.svelte';
	import SelectControl from './select-control.svelte';
	import TextControl from './text-control.svelte';
	import { get_store } from '$stores';
	import { sprintf, __ } from '@wordpress/i18n';

	export let taxonomy: Taxonomy;
	export let terms: TermsStore;

	const editor = get_store( 'editor' );
	const notices = get_store( 'notices' );
	const class_prefix = 'editor-post-taxonomies__hierarchical-terms';
	let is_creating_term = false;
	let is_create_button_disabled = true;
	let term_options: SelectControlOption[];

	function make_option( level: number, prev: SelectControlOption[], current: TermWithChildren ): SelectControlOption[] {
		const { id: value, name: label, children = [] } = current;
		let next = [
			...prev,
			{
				value,
				label: level === 0 ? label : `${ ' '.repeat( 3 * level ) }${ label }`,
			},
		];

		if ( children.length ) {
			next = children.reduce(
				( children_prev: SelectControlOption[], child: TermWithChildren ) =>
					make_option( level + 1, children_prev, child ),
				next,
			);
		}

		return next;
	}

	$: ( { labels, name, rest_base, slug, __can__ } = taxonomy );
	$: ( { add_new_item, parent_item, singular_name, new_item_name } = labels );
	$: {
		if ( $terms.sorted ) {
			term_options = [
				{
					label: `— ${ parent_item } —`,
					value: '',
				},
				...$terms.sorted.reduce( ( prev, current ) => make_option( 0, prev, current ), [] ),
			];
		}
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

			editor.add_term( rest_base, id );
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
</script>

<Panel title={name}>
	<div class="{class_prefix}-list">
		<HierarchicalTermsChoice {class_prefix} {taxonomy} terms={$terms.sorted || []} />
	</div>
	{#if __can__.create}
		<button
			aria-expanded={is_creating_term}
			class="{class_prefix}-add components-button is-link"
			type="button"
			on:click={handle_click_toggle}>{add_new_item}</button
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
				<button class="components-button {class_prefix}-submit is-secondary" disabled={is_create_button_disabled}
					>{add_new_item}</button
				>
			</form>
		{/if}
	{/if}
</Panel>
