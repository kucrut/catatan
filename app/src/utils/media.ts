/* eslint-disable object-shorthand, prefer-rest-params, @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type */

import type { SelectControlOption, WP_REST_API_Media, WP_REST_API_Media_Size } from '$types';
import type { WPImageAttributes } from '../tiptap-extensions/wp-image';

// Borrowed from Gutenberg's source: packages/media-utils/src/components/media-upload/index.js

const { wp } = window;

const FeaturedImageController = wp.media.controller.FeaturedImage.extend( {
	// The core version has a bug; it always sets the selection to the _saved_ featured image
	// even though we're opening the frame for the second time after changing the featured image.
	activate: function () {
		wp.media.controller.Library.prototype.activate.apply( this, arguments );
	},
} );

export const FeaturedImageFrame = wp.media.view.MediaFrame.Select.extend( {
	/**
	 * Enables the Set Featured Image Button.
	 *
	 * @param {Object} toolbar toolbar for featured image state
	 * @return {void}
	 */
	featuredImageToolbar( toolbar ): void {
		this.createSelectToolbar( toolbar, {
			text: wp.media.view.l10n.setFeaturedImage,
			state: this.options.state,
		} );
	},

	/**
	 * Handle the edit state requirements of selected media item.
	 */
	editState(): void {
		const selection = this.state( 'featured-image' ).get( 'selection' );
		const view = new wp.media.view.EditImage( {
			model: selection.single(),
			controller: this,
		} ).render();

		// Set the view to the EditImage frame using the selected image.
		this.content.set( view );

		// After bringing in the frame, load the actual editor via an ajax call.
		view.loadEditor();
	},

	/**
	 * Create the default states.
	 */
	createStates: function createStates(): void {
		this.on( 'toolbar:create:featured-image', this.featuredImageToolbar, this );
		this.on( 'content:render:edit-image', this.editState, this );

		this.states.add( [
			new FeaturedImageController(),
			new wp.media.controller.EditImage( {
				model: this.options.editImage,
			} ),
		] );
	},
} );

// TODO: Add image sizes dropdown on the frame sidebar.
export const InsertImageFrame = wp.media.view.MediaFrame.Select.extend( {} );

export function get_attachments_collection( ids: number[] ) {
	return wp.media.query( {
		order: 'ASC',
		orderby: 'post__in',
		post__in: ids,
		posts_per_page: -1,
		query: true,
		type: 'image',
	} );
}

export function generate_attributes( media: WP_REST_API_Media, target_size = 'medium' ): WPImageAttributes {
	const { alt, caption, id, media_details } = media;
	const { sizes } = media_details;
	const size_names = target_size === 'full' ? [ target_size ] : [ target_size, 'full' ];

	let size_name: string;
	let size_data: WP_REST_API_Media_Size;

	for ( const size of size_names ) {
		if ( size in sizes ) {
			size_name = size;
			size_data = sizes[ size_name ];
			break;
		}
	}

	return {
		id,
		caption: caption?.raw || '',
		size: size_name,
		img: {
			alt,
			height: size_data.height,
			src: size_data.source_url,
			width: size_data.width,
		},
	};
}

export function get_attachment_size_options( media: WP_REST_API_Media ): SelectControlOption[] {
	const { media_details } = media;
	const { sizes } = media_details;

	return Object.keys( sizes ).map( size => ( {
		label: size,
		value: size,
	} ) );
}
