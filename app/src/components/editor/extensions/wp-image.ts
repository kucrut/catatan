import { Node, type Attributes, type Command, type JSONContent } from '@tiptap/core';

const class_name = 'wp-block-image';
const attachment_id_class_prefix = 'wp-image-';
const attachment_id_regex = new RegExp( `((${ attachment_id_class_prefix })(\\d+))` );

export interface WPImageAttributes {
	attachmentId: number;
	imgAttrs: {
		alt: string;
		height?: number;
		loading?: 'eager' | 'lazy';
		src: string;
		width?: number;
	};
	size?: string;
}

export interface WPImageOptions {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	HTMLAttributes: Record< string, any >;
}

declare module '@tiptap/core' {
	interface Commands< ReturnType > {
		wpImage: {
			/**
			 * Insert image from WP media library
			 */
			setWPImage: ( options: WPImageAttributes, content?: JSONContent[] ) => ReturnType;
		};
	}
}

export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export const WPImage = Node.create< WPImageOptions >( {
	content: 'inline*',
	draggable: true,
	group: 'block',
	name: 'wp-image',

	addAttributes() {
		return {
			attachmentId: {
				default: null,
				parseHTML: ( element ): number | null => {
					if ( ! element.firstElementChild || element.firstElementChild.nodeName !== 'IMG' ) {
						return null;
					}

					const img = element.firstElementChild as HTMLImageElement;
					const id_match = attachment_id_regex.exec( img.className );

					return id_match ? Number( id_match[ 3 ] ) : null;
				},
			},
			imgAttrs: {
				default: null,
				parseHTML: ( element ): WPImageAttributes[ 'imgAttrs' ] | null => {
					if ( ! element.firstElementChild || element.firstElementChild.nodeName !== 'IMG' ) {
						return null;
					}

					const img = element.firstElementChild as HTMLImageElement;

					return {
						alt: img.alt,
						src: img.src,
					};
				},
			},
			size: {
				default: null,
				parseHTML: ( element ): string | null => {
					let found: string;

					for ( const cls of element.classList.entries() ) {
						const [ , item ] = cls;
						if ( item.startsWith( 'size-' ) ) {
							found = item;
							break;
						}
					}

					return found || null;
				},
			},
		};
	},

	parseHTML() {
		return [
			{
				priority: 1,
				tag: 'figure',
				getAttrs: ( node ): false | Attributes => {
					if ( typeof node === 'string' ) {
						return false;
					}

					return node.classList.contains( class_name ) && null;
				},
			},
		];
	},

	renderHTML( { HTMLAttributes } ) {
		const { attachmentId, imgAttrs, size } = HTMLAttributes;
		let figure_class = class_name;
		let image_attributes = { ...imgAttrs };

		if ( size ) {
			figure_class = `${ figure_class } size-${ size }`;
		}

		if ( attachmentId ) {
			image_attributes = {
				...image_attributes,
				class: `wp-image-${ attachmentId }`,
			};
		}

		return [ 'figure', { class: figure_class }, [ 'img', image_attributes ], [ 'figcaption', {}, 0 ] ];
	},

	addCommands() {
		return {
			setWPImage: ( options, content ): Command => {
				return ( { commands } ) => {
					return commands.insertContent( {
						content,
						type: this.name,
						attrs: options,
					} );
				};
			},
		};
	},
} );

export default WPImage;