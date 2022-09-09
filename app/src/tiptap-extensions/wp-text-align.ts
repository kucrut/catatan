// Based on @tiptap/extension-text-align

import { Extension, type RawCommands } from '@tiptap/core';

export interface WpTextAlignOptions {
	types: string[];
	alignments: string[];
	defaultAlignment: string;
}

export interface WpTextAlignAttributes {
	class?: string;
}

declare module '@tiptap/core' {
	interface Commands< ReturnType > {
		wpTextAlign: {
			/**
			 * Set the text align attribute
			 */
			setWpTextAlign: ( alignment: string ) => ReturnType;
			/**
			 * Unset the text align attribute
			 */
			unsetWpTextAlign: () => ReturnType;
		};
	}
}

const class_prefix = 'has-text-align-';

const TextAlign = Extension.create< WpTextAlignOptions >( {
	name: 'wpTextAlign',

	addOptions() {
		return {
			types: [],
			alignments: [ 'left', 'center', 'right', 'justify' ],
			defaultAlignment: 'left',
		};
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					wpTextAlign: {
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

						renderHTML: ( attributes ): WpTextAlignAttributes => {
							if ( attributes.wpTextAlign === this.options.defaultAlignment ) {
								return {};
							}

							return { class: class_prefix + attributes.wpTextAlign };
						},
					},
				},
			},
		];
	},

	addCommands(): Partial< RawCommands > {
		return {
			setWpTextAlign: alignment => {
				return ( { commands } ) => {
					if ( ! this.options.alignments.includes( alignment ) ) {
						return false;
					}

					return this.options.types.every( type => commands.updateAttributes( type, { wpTextAlign: alignment } ) );
				};
			},

			unsetWpTextAlign: () => {
				return ( { commands } ) => {
					return this.options.types.every( type => commands.resetAttributes( type, 'wpTextAlign' ) );
				};
			},
		};
	},
	addKeyboardShortcuts() {
		return {
			'Mod-Shift-l': (): boolean => this.editor.commands.setWpTextAlign( 'left' ),
			'Mod-Shift-e': (): boolean => this.editor.commands.setWpTextAlign( 'center' ),
			'Mod-Shift-r': (): boolean => this.editor.commands.setWpTextAlign( 'right' ),
			'Mod-Shift-j': (): boolean => this.editor.commands.setWpTextAlign( 'justify' ),
		};
	},
} );

export { TextAlign, TextAlign as default };
