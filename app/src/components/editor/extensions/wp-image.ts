import { Node, type Attributes, type Command, type JSONContent } from '@tiptap/core';

const class_name = 'wp-block-image';

export interface WPImageAttributes {
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
	group: 'block',
	name: 'wp-image',

	draggable: true,

	addAttributes() {
		return {
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
		const { size, imgAttrs } = HTMLAttributes;
		let figure_class = class_name;

		if ( size ) {
			figure_class = `${ figure_class } size-${ size }`;
		}

		return [ 'figure', { class: figure_class }, [ 'img', imgAttrs ], [ 'figcaption', {}, 0 ] ];
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
