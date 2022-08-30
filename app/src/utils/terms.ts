import type { TokenItem } from '$types';
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
