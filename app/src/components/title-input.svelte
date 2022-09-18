<script lang="ts">
	import { __ } from '@wordpress/i18n';
	import { get_store } from '$stores';
	import { no_enter } from '$actions/no-enter';

	type TitleInputEvent = Event & { currentTarget: HTMLHeadingElement };

	const editor = get_store( 'editor' );
	const placeholder = __( 'Add title' );

	function handle_input( event: TitleInputEvent ): void {
		editor.update( { title: event.currentTarget.innerText } );
	}

	function handle_keyup( event: TitleInputEvent ): void {
		// Because we're using a block element (h1), the browser will most probably insert a <br/> tag.
		if ( event.currentTarget.innerText === '\n' ) {
			// Let's clean it up.
			event.currentTarget.innerHTML = '';
		}
	}

	function handle_paste( event: ClipboardEvent & { currentTarget: HTMLHeadingElement } ): void {
		// We don't want _any_ markup in our post title.
		const text = event.clipboardData.getData( 'text/plain' );
		// event.clipboardData.setData( 'text/plain', text );
		const range = document.getSelection().getRangeAt( 0 );
		range.deleteContents();

		// Credit: https://htmldom.dev/paste-as-plain-text/
		const text_node = document.createTextNode( text );
		range.insertNode( text_node );
		range.selectNodeContents( text_node );
		range.collapse( false );

		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange( range );

		// We've prevented the paste event, so let's trigger the input event :wink:
		event.currentTarget.dispatchEvent( new Event( 'input' ) );
	}
</script>

<div class="edit-post-visual-editor__post-title-wrapper" contenteditable="false">
	<label for="post-title" class="screen-reader-text">{__( 'Post Title' )}</label>
	<h1
		aria-label={placeholder}
		aria-multiline="true"
		class="wp-block wp-block-post-title block-editor-block-list__block editor-post-title editor-post-title__input rich-text"
		contenteditable="true"
		data-placeholder={placeholder}
		role="textbox"
		on:input={handle_input}
		on:keyup={handle_keyup}
		on:paste|preventDefault={handle_paste}
		use:no_enter
	>
		{$editor.data.title}
	</h1>
</div>

<style lang="postcss">
	/* stylelint-disable custom-property-pattern */
	.edit-post-visual-editor__post-title-wrapper {
		margin-block-start: 2rem;
		margin-block-end: 0.5rem;
	}

	h1 {
		white-space: pre-wrap;
		min-width: 1px;
		margin-block: unset;
		margin-inline: auto;
		font-family: var( --wp--preset--font-family--source-serif-pro, serif );
		font-size: var( --wp--custom--typography--font-size--gigantic, clamp( 2.75rem, 6vw, 3.25rem ) );
		font-weight: 300;
		line-height: var( --wp--custom--typography--line-height--tiny, 1.15 );

		&:empty::before {
			content: attr( data-placeholder );
			pointer-events: none;
			display: block;
			position: absolute;
			opacity: 0.62;
		}
	}
</style>
