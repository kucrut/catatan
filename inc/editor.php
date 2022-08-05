<?php
declare( strict_types = 1 );

namespace Catatan\Editor;

use Catatan;

/**
 * Editor bootstrapper
 *
 * @since 0.0.1
 *
 * @return void
 */
function bootstrap(): void {
	add_action( Catatan\get_editor_page_load_hookname(), __NAMESPACE__ . '\\load' );
}

/**
 * Load editor page
 *
 * @since 0.0.1
 *
 * @return void
 */
function load(): void {
	enqueue_assets();

	add_action( 'admin_print_scripts', __NAMESPACE__ . '\\print_assets' );
}

/**
 * Enqueue assets
 *
 * @since 0.0.1
 *
 * @return void
 */
function enqueue_assets(): void {
	wp_enqueue_style( 'wp-components' );
	wp_enqueue_style( 'wp-edit-post' );
}

/**
 * Print assets
 *
 * TODO: Use vite-for-wp for this
 *
 * @since 0.0.1
 *
 * @return void
 */
function print_assets(): void {
	$data = [
		'editor_id' => CATATAN\EDITOR_ID,
		'post_id' => isset( $_REQUEST['id'] ) ? (int) $_REQUEST['id'] : 0,
	];
	?>
<script>
	var catatanEditor = <?php echo json_encode( $data ); ?>;
</script>
<script type="module" src="http://localhost:5173/@vite/client"></script>
<script type="module" src="http://localhost:5173/src/main.ts"></script>
	<?php
}

/**
 * Render editor page
 *
 * @since 0.0.1
 *
 * @return void
 */
function render_page(): void {
	printf( '<div id="%s"></div>', esc_attr( CATATAN\EDITOR_ID ) );
}

/**
 * Render editor page
 *
 * @since 0.0.1
 *
 * @return void
 */
function render_page_temp(): void {
	?>
<div class="block-editor">
	<h1 class="screen-reader-text">Add New Page</h1>
	<div class="block-editor__container">
		<div class="edit-post-layout is-mode-visual is-sidebar-opened interface-interface-skeleton">
			<div class="interface-interface-skeleton__editor">
				<div class="interface-interface-skeleton__header" role="region" aria-label="Editor top bar" tabindex="-1">
					<div class="edit-post-header">
						<div class="edit-post-header__toolbar">
							<div role="toolbar" aria-orientation="horizontal" aria-label="Document tools" class="components-accessible-toolbar edit-post-header-toolbar">
								<div class="edit-post-header-toolbar__left">
								</div>
							</div>
						</div>
						<div class="edit-post-header__settings">
							<button type="button" class="components-button is-tertiary">Save draft</button>
							<div class="components-dropdown components-dropdown-menu block-editor-post-preview__dropdown" tabindex="-1">
								<button type="button" aria-haspopup="true" class="components-button block-editor-post-preview__button-toggle components-dropdown-menu__toggle is-tertiary">Preview</button>
							</div>
							<button type="button" class="components-button editor-post-preview is-tertiary">Preview<span class="components-visually-hidden">(opens in a new tab)</span></button>
							<button type="button" class="components-button editor-post-publish-panel__toggle editor-post-publish-button__button is-primary">Publish</button>
							<div class="interface-pinned-items">
								<button type="button" aria-pressed="true" aria-expanded="true" class="components-button is-pressed has-icon" aria-label="Settings"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="M10.289 4.836A1 1 0 0111.275 4h1.306a1 1 0 01.987.836l.244 1.466c.787.26 1.503.679 2.108 1.218l1.393-.522a1 1 0 011.216.437l.653 1.13a1 1 0 01-.23 1.273l-1.148.944a6.025 6.025 0 010 2.435l1.149.946a1 1 0 01.23 1.272l-.653 1.13a1 1 0 01-1.216.437l-1.394-.522c-.605.54-1.32.958-2.108 1.218l-.244 1.466a1 1 0 01-.987.836h-1.306a1 1 0 01-.986-.836l-.244-1.466a5.995 5.995 0 01-2.108-1.218l-1.394.522a1 1 0 01-1.217-.436l-.653-1.131a1 1 0 01.23-1.272l1.149-.946a6.026 6.026 0 010-2.435l-1.148-.944a1 1 0 01-.23-1.272l.653-1.131a1 1 0 011.217-.437l1.393.522a5.994 5.994 0 012.108-1.218l.244-1.466zM14.929 12a3 3 0 11-6 0 3 3 0 016 0z" clip-rule="evenodd"></path></svg></button>
							</div>
						</div>
					</div>
				</div>
				<div class="interface-interface-skeleton__body">
					<div class="interface-interface-skeleton__notices"><div class="components-snackbar-list components-editor-notices__snackbar" tabindex="-1"></div></div>
					<div class="interface-interface-skeleton__content" role="region" aria-label="Editor content" tabindex="-1">
						<div class="components-notice-list components-editor-notices__pinned"></div>
						<div class="components-notice-list components-editor-notices__dismissible"></div>
						<div class="edit-post-visual-editor">
							<div class="edit-post-visual-editor__content-area">
								<div class="is-desktop-preview" style="height: 100%; width: 100%; margin: 0px; display: flex; flex-flow: column nowrap; background: white none repeat scroll 0% 0%;">
									<div class="editor-styles-wrapper block-editor-writing-flow">
										<div class="edit-post-visual-editor__post-title-wrapper" contenteditable="false" style="padding: 0 60px">
											<h1 class="wp-block wp-block-post-title block-editor-block-list__block editor-post-title editor-post-title__input rich-text is-selected" aria-label="Add title" role="textbox" aria-multiline="true" contenteditable="true">
												<span data-rich-text-placeholder="Add title" style="pointer-events:none;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;" contenteditable="false"></span>
											</h1>
										</div>
										<div id="editor">
											<p>Boo</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="interface-interface-skeleton__sidebar" role="region" aria-label="Editor settings" tabindex="-1">
						<div class="interface-complementary-area edit-post-sidebar">
							<div class="components-panel__header interface-complementary-area-header edit-post-sidebar__panel-tabs" tabindex="-1">
								<ul>
									<li><button type="button" aria-label="Page (selected)" data-label="Page" class="components-button edit-post-sidebar__panel-tab is-active">Page</button></li>
								</ul>
								<button type="button" class="components-button has-icon" aria-label="Close settings"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"></path></svg></button>
							</div>
							<div class="components-panel">
								<div class="components-panel__body">
									<h2 class="components-panel__body-title">
										<button type="button" aria-expanded="false" class="components-button components-panel__body-toggle"><span aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="components-panel__arrow" aria-hidden="true" focusable="false"><path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path></svg></span>Status &amp; visibility</button>
									</h2>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
	<?php
}
