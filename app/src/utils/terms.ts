import type { TermWithChildren } from '$stores/terms';
import type { SelectControlOption, TokenItem } from '$types';
import type { WP_REST_API_Term } from 'wp-types';

export function map_id_to_token_item(
	terms: WP_REST_API_Term[],
	term_id: number,
	index: number,
	self: number[],
): TokenItem {
	const term = terms.find( ( { id } ) => term_id === id );

	if ( ! term ) {
		return null;
	}

	const { id, name } = term;

	return {
		id,
		description: `${ name } (${ index } of ${ self.length }`,
		label: name,
	};
}

export function term_to_option(
	level: number,
	prev: SelectControlOption[],
	current: TermWithChildren,
): SelectControlOption[] {
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
				term_to_option( level + 1, children_prev, child ),
			next,
		);
	}

	return next;
}
