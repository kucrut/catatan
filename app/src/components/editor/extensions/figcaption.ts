// Based on https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/content_editor/extensions/figure_caption.js

import { Node } from '@tiptap/core';

export default Node.create( {
	name: 'figcaption',
	content: 'inline*',
	group: 'block',
	defining: true,

	parseHTML() {
		return [ { tag: 'figcaption' } ];
	},

	renderHTML( { HTMLAttributes } ) {
		return [ 'figcaption', HTMLAttributes, 0 ];
	},
} );
