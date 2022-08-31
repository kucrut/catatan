<script lang="ts">
	import type { WP_Media } from '$types';
	import { get_attachments_collection, get_featured_image_media_frame } from '$utils/media';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	interface FrameEvents {
		close: undefined;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		open: { frame: any };
		select: { selection: WP_Media[] };
	}

	export let selected: number;

	const { wp } = window;
	const dispatch = createEventDispatcher< FrameEvents >();
	let frame;

	function handle_select() {
		const selection = frame.state().get( 'selection' ).toJSON();

		dispatch( 'select', { selection } );
	}

	function create_frame() {
		const featuredImageFrame = get_featured_image_media_frame();

		const attachments = get_attachments_collection( selected > 0 ? [ selected ] : null );
		const selection = new wp.media.model.Selection( attachments.models, {
			props: attachments.props.toJSON(),
		} );

		frame = new featuredImageFrame( {
			selection,
			editing: false, // TODO.
			mimeType: [ 'image' ],
			multiple: false,
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
