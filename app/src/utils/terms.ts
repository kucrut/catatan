import type { TermWithChildren } from '$stores/terms';
import type { SelectControlOption } from '$types';

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

export function filter_by_name( search: string, term: TermWithChildren ): TermWithChildren | null {
	if ( ! search ) {
		return term;
	}

	const children = term.children.map( item => filter_by_name( search, item ) ).filter( t => t !== null );

	return children.length || term.name.toLocaleLowerCase().includes( search.toLowerCase() )
		? { ...term, children }
		: null;
}

export function filter_choices( terms: TermWithChildren[], search: string ): TermWithChildren[] {
	return terms.map( item => filter_by_name( search, item ) ).filter( t => t !== null );
}
