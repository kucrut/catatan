// Borrowed from Gutenberg's source.

const { wp } = window;

/**
 * Prepare the Featured Image toolbars and frames.
 *
 */
export function get_featured_image_media_frame(): typeof wp.media.view.MediaFrame.Select {
	return wp.media.view.MediaFrame.Select.extend( {
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
				new wp.media.controller.FeaturedImage(),
				new wp.media.controller.EditImage( {
					model: this.options.editImage,
				} ),
			] );
		},
	} );
}
