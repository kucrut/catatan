import type { Extensions } from '@tiptap/core';
import { __ } from '@wordpress/i18n';
import code_block_lowlight from '@tiptap/extension-code-block-lowlight';
import image from '@tiptap/extension-image';
import placeholder from '@tiptap/extension-placeholder';
import starter_kit from '@tiptap/starter-kit';
import text_align from './text-align';
import { lowlight } from 'lowlight/lib/common';

lowlight.registerAlias( 'javascript', 'js' );
lowlight.registerAlias( 'typescript', 'ts' );

export function get_extensions(): Extensions {
	return [
		image,
		text_align.configure( {
			types: [ 'heading', 'paragraph' ],
		} ),
		code_block_lowlight.configure( { lowlight } ),
		placeholder.configure( {
			placeholder: __( 'Start writing…' ),
		} ),
		starter_kit.configure( {
			codeBlock: {
				HTMLAttributes: { class: 'hljs' },
			},
			heading: {
				levels: [ 2, 3, 4, 5, 6 ],
			},
		} ),
	];
}
