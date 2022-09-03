import { Node, type Attributes, type Command, type JSONContent } from '@tiptap/core';

const class_name = 'wp-block-image';
const attachment_id_class_prefix = 'wp-image-';
const attachment_id_regex = new RegExp( `((${ attachment_id_class_prefix })(\\d+))` );
const size_class_prefix = 'size-';
const size_class_regex = new RegExp( `((${ size_class_prefix })(\\w+))` );

export interface WPImageAttributes {
	attachmentId: number;
	imgAttrs: {
		alt: string;
		height?: number;
		loading?: 'eager' | 'lazy';
		sizes?: string;
		src: string;
		srcset?: string;
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

export const WPImage = Node.create< WPImageOptions >( {
	content: 'inline*',
	draggable: true,
	group: 'block',
	name: 'wpImage',

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
						sizes: img.sizes,
						src: img.src,
						srcset: img.srcset,
					};
				},
			},
			size: {
				default: null,
				parseHTML: ( element ): string | null => {
					const size_match = size_class_regex.exec( element.className );

					return size_match ? size_match[ 3 ] : null;
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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	renderHTML( { node, HTMLAttributes } ): any {
		const { attachmentId, imgAttrs, size } = HTMLAttributes;
		let figure_class = class_name;

		if ( size ) {
			figure_class = `${ figure_class } ${ size_class_prefix }${ size }`;
		}

		return [
			'figure',
			{ class: figure_class },
			[
				'img',
				{
					...imgAttrs,
					class: attachmentId ? attachment_id_class_prefix + attachmentId : null,
				},
			],
			// TODO: Find better way for this.
			node.textContent ? [ 'figcaption', {}, 0 ] : null,
		].filter( i => i !== null );
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
