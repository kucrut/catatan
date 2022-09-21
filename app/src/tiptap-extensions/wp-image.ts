import { mergeAttributes, Node, type Attributes, type Command, type JSONContent } from '@tiptap/core';

const class_name = 'wp-block-image';
const attachment_id_class_prefix = 'wp-image-';
const attachment_id_regex = new RegExp( `((${ attachment_id_class_prefix })(\\d+))` );
const size_class_prefix = 'size-';
const size_class_regex = new RegExp( `((${ size_class_prefix })(\\w+))` );

export interface WPImageAttributes {
	caption?: string | null;
	id: number;
	img: {
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
			insertWPImage: ( options: WPImageAttributes, content?: JSONContent[] ) => ReturnType;
		};
	}
}

export const WPImage = Node.create< WPImageOptions >( {
	allowGapCursor: true, // TODO: Make this work!
	content: 'inline*',
	draggable: true,
	group: 'block',
	name: 'wpImage',

	addAttributes() {
		return {
			caption: {
				default: null,
				parseHTML: ( element ): string | null => {
					const figcaption = element.querySelector( ':scope > figcaption' ) as HTMLElement | null;

					return figcaption?.innerText || null;
				},
			},
			id: {
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
			img: {
				default: null,
				parseHTML: ( element ): WPImageAttributes[ 'img' ] | null => {
					if ( ! element.firstElementChild || element.firstElementChild.nodeName !== 'IMG' ) {
						return null;
					}

					const img = element.firstElementChild as HTMLImageElement;

					return {
						alt: img.alt,
						sizes: img.sizes || null,
						src: img.src,
						srcset: img.srcset || null,
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
				tag: 'figure',
				getAttrs: ( node ): false | Attributes => {
					return typeof node !== 'string' &&
						node.classList.contains( class_name ) &&
						node.firstElementChild &&
						node.firstElementChild.tagName === 'IMG'
						? null
						: false;
				},
			},
		];
	},

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	renderHTML( { HTMLAttributes } ): any {
		const { caption, id, img, size, ...rest } = HTMLAttributes;
		let figure_class = class_name;

		if ( size ) {
			figure_class = `${ figure_class } ${ size_class_prefix }${ size }`;
		}

		return [
			'figure',
			mergeAttributes( { class: figure_class }, rest ),
			[
				'img',
				{
					...img,
					class: id ? attachment_id_class_prefix + id : null,
				},
			],
			typeof caption === 'string' ? [ 'figcaption', {}, 0 ] : null,
		].filter( i => i !== null );
	},

	addCommands() {
		return {
			insertWPImage: ( options, content ): Command => {
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
