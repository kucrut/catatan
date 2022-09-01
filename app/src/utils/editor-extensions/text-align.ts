/* eslint-disable @typescript-eslint/explicit-function-return-type */

import text_align from '@tiptap/extension-text-align';

const class_prefix = 'has-text-align-';

export default text_align.extend( {
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					textAlign: {
						default: this.options.defaultAlignment,
						parseHTML: element => {
							let found: string;

							this.options.alignments.forEach( alignment => {
								if ( element.classList.contains( class_prefix + alignment ) ) {
									found = alignment;
								}
							} );

							return found || this.options.defaultAlignment;
						},
						renderHTML: attributes => {
							if ( attributes.textAlign === this.options.defaultAlignment ) {
								return {};
							}

							return { class: class_prefix + attributes.textAlign };
						},
					},
				},
			},
		];
	},
} );
