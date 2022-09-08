<script lang="ts">
	import type { WP_Media } from '$types';
	import { FeaturedImageFrame, InsertImageFrame } from '$utils/media';
	import { createEventDispatcher, onMount } from 'svelte';

	interface FrameEvents {
		close: undefined;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		open: { frame: any };
		select: { selection: WP_Media[] };
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type FrameOptions = { [ k: string ]: any };
	type FrameType = 'featured-image' | 'insert';

	export let options: FrameOptions = {};
	export let selected: number[] = [];
	export let type: FrameType;

	const { wp } = window;
	const dispatch = createEventDispatcher< FrameEvents >();
	let frame;

	function handle_open() {
		const ids = selected.filter( id => typeof id === 'number' && id > 0 );

		if ( ids.length ) {
			const selection = frame.state().get( 'selection' );
			ids.forEach( id => selection.add( wp.media.attachment( id ) ) );
		}

		dispatch( 'open', { frame } );
	}

	function handle_select() {
		const selection = frame.state().get( 'selection' ).toJSON();

		dispatch( 'select', { selection } );
	}

	function create_frame() {
		switch ( type ) {
			case 'featured-image':
				frame = new FeaturedImageFrame( {
					...options,
					editing: false, // TODO.
					mimeType: [ 'image' ],
					multiple: false,
					state: 'featured-image',
				} );
				break;

			default: // insert.
				frame = new InsertImageFrame( {
					...options,
					editing: false,
					multiple: false,
					state: 'library',
					library: {
						...( options.library || {} ),
						type: [ 'image' ],
					},
				} );
				break;
		}

		frame.on( 'close', () => dispatch( 'close' ) );
		frame.on( 'open', handle_open );
		frame.on( 'select', handle_select );
		frame.off( 'open', frame.updateSelection, frame );

		wp.media.frame = frame;
	}

	onMount( () => {
		create_frame();
		frame.open();

		return () => frame.remove();
	} );
</script>
