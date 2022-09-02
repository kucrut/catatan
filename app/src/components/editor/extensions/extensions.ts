import type { Extensions } from '@tiptap/core';
import { __ } from '@wordpress/i18n';
import code_block_lowlight from '@tiptap/extension-code-block-lowlight';
import image from '@tiptap/extension-image';
import link from '@tiptap/extension-link';
import placeholder from '@tiptap/extension-placeholder';
import starter_kit from '@tiptap/starter-kit';
import subscript from '@tiptap/extension-subscript';
import superscript from '@tiptap/extension-superscript';
import table from '@tiptap/extension-table';
import table_cell from '@tiptap/extension-table-cell';
import table_header from '@tiptap/extension-table-header';
import table_row from '@tiptap/extension-table-row';
import youtube from '@tiptap/extension-youtube';
import { lowlight } from 'lowlight/lib/common';

import figcaption from './figcaption';
import figure from './figure';
import text_align from './text-align';

export function get_extensions(): Extensions {
	return [
		figcaption,
		figure,
		image,
		subscript,
		superscript,
		table,
		table_cell,
		table_header,
		table_row,
		code_block_lowlight.configure( {
			lowlight,
			HTMLAttributes: { class: 'hljs' },
		} ),
		link.configure( {
			openOnClick: false,
		} ),
		text_align.configure( {
			types: [ 'heading', 'paragraph' ],
		} ),
		placeholder.configure( {
			placeholder: __( 'Start writing…' ),
		} ),
		starter_kit.configure( {
			codeBlock: false,
			heading: {
				levels: [ 2, 3, 4, 5, 6 ],
			},
		} ),
		youtube.configure( {
			width: 640,
			height: 360,
		} ),
	];
}
