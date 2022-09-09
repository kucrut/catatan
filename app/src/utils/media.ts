import type { Config, SelectControlOption, WP_REST_API_Media, WP_REST_API_Media_Size } from '$types';
import type { WPImageAttributes } from '../tiptap-extensions/wp-image';

export function generate_attributes( media: WP_REST_API_Media, target_size = 'medium' ): WPImageAttributes {
	const { alt_text, caption, id, media_details } = media;

	const { sizes } = media_details;
	const size_names = target_size === 'full' ? [ target_size ] : [ target_size, 'full' ];

	let size_name: string;
	let size_data: WP_REST_API_Media_Size;

	for ( const size of size_names ) {
		if ( size in sizes ) {
			size_name = size;
			size_data = sizes[ size_name ];
			break;
		}
	}

	return {
		id,
		caption: caption?.raw || '',
		size: size_name,
		img: {
			alt: alt_text,
			height: size_data.height,
			src: size_data.source_url,
			width: size_data.width,
		},
	};
}

export function get_attachment_size_options(
	media: WP_REST_API_Media,
	avaliable_sizes: Config[ 'image_size_names' ],
): SelectControlOption[] {
	const { media_details } = media;
	const { sizes } = media_details;

	return Object.entries( avaliable_sizes )
		.filter( ( [ size ] ) => size in sizes )
		.map( ( [ value, label ] ) => ( { label, value } ) );
}
