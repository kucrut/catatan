<script lang="ts">
	import type { WP_Media } from '$types';
	import { get_featured_image_media_frame } from '$utils/media';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	interface FrameEvents {
		close: undefined;
		open: { frame: any };
		select: { selection: WP_Media[] };
	}

	const { wp } = window;
	const dispatch = createEventDispatcher< FrameEvents >();
	let frame;

	function handle_select() {
		const selection = frame.state().get( 'selection' ).toJSON();

		dispatch( 'select', { selection } );
	}

	function create_frame() {
		const featuredImageFrame = get_featured_image_media_frame();

		// TODO
		// const attachments = getAttachmentsCollection( [] );
		// const selection = new wp.media.model.Selection( null, {
		// 	props: attachments.props.toJSON(),
		// } );

		frame = new featuredImageFrame( {
			editing: false, // TODO.
			mimeType: [ 'image' ],
			multiple: false,
			// selection, TODO.
			state: 'featured-image',
		} );

		frame.on( 'close', () => dispatch( 'close' ) );
		frame.on( 'open', () => dispatch( 'open', { frame } ) );
		frame.on( 'select', handle_select );

		wp.media.frame = frame;
	}

	onDestroy( () => {
		frame.remove();
	} );

	onMount( () => {
		create_frame();
		frame.open();
	} );
</script>
