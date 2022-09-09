import { Extension, type RawCommands } from '@tiptap/core';

export interface WpAlignmentAttributes {
	class?: string;
}

export interface WpAlignmentOptions {
	types: string[];
	alignments: string[];
	defaultAlignment: string;
}

declare module '@tiptap/core' {
	interface Commands< ReturnType > {
		wpAlignment: {
			setWpAlignment: ( alignment: string ) => ReturnType;
			unsetWpAlignment: () => ReturnType;
		};
	}
}

export const alignments = [ 'none', 'left', 'center', 'right' ];

const class_prefix = 'align';

const WpAlignment = Extension.create< WpAlignmentOptions >( {
	name: 'wpAlignment',

	addOptions() {
		return {
			alignments,
			types: [],
			defaultAlignment: 'none',
		};
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					wpAlignment: {
						default: this.options.defaultAlignment,
						parseHTML: ( element ): string => {
							let found: string;

							this.options.alignments.forEach( alignment => {
								if ( element.classList.contains( class_prefix + alignment ) ) {
									found = alignment;
								}
							} );

							return found || this.options.defaultAlignment;
						},

						renderHTML: ( attributes ): WpAlignmentAttributes => {
							if ( attributes.wpAlignment === this.options.defaultAlignment ) {
								return {};
							}

							return { class: class_prefix + attributes.wpAlignment };
						},
					},
				},
			},
		];
	},

	addCommands(): Partial< RawCommands > {
		return {
			setWpAlignment: alignment => {
				return ( { commands } ) => {
					if ( ! this.options.alignments.includes( alignment ) ) {
						return false;
					}

					return this.options.types.every( type => commands.updateAttributes( type, { wpAlignment: alignment } ) );
				};
			},

			unsetWpAlignment: () => {
				return ( { commands } ) => {
					return this.options.types.every( type => commands.resetAttributes( type, 'wpAlignment' ) );
				};
			},
		};
	},
} );

export { WpAlignment, WpAlignment as default };
