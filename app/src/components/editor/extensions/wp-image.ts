import { Node, type Attributes, type Command, type JSONContent } from '@tiptap/core';

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
			setWPImage: ( options: { src: string; size?: string; alt: string }, content?: JSONContent[] ) => ReturnType;
		};
	}
}

export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

const class_name = 'wp-block-image';

type ImgAttribute = 'alt' | 'src';

function get_img_attribute( attribute: ImgAttribute, element: HTMLElement ): string | null {
	if ( ! element.firstElementChild || element.firstElementChild.nodeName !== 'IMG' ) {
		return null;
	}

	const img = element.firstElementChild as HTMLImageElement;
	return img[ attribute ];
}

export const WPImage = Node.create< WPImageOptions >( {
	content: 'inline*',
	group: 'block',
	name: 'wp-image',

	draggable: true,

	addAttributes() {
		return {
			alt: {
				default: null,
				parseHTML: ( element ): string | null => get_img_attribute( 'alt', element ),
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
			src: {
				default: null,
				parseHTML: ( element ): string | null => get_img_attribute( 'src', element ),
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
		const { size, ...img_attributes } = HTMLAttributes;
		let figure_class = class_name;

		if ( size ) {
			figure_class = `${ figure_class } size-${ size }`;
		}

		return [ 'figure', { class: figure_class }, [ 'img', img_attributes ], [ 'figcaption', {}, 0 ] ];
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
