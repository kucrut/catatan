<?php
declare( strict_types = 1 );

namespace Catatan\Editor;

use Catatan;
use WP_Post_Type;

/**
 * Editor bootstrapper
 *
 * @since 0.0.1
 *
 * @return void
 */
function bootstrap(): void {
	add_action( 'registered_post_type', __NAMESPACE__ . '\\register_menu', 10, 2 );
}

/**
 * Replace post type's "Add new" submenu
 *
 * @since 0.0.1
 *
 * @param string       $post_type Post type name.
 * @param WP_Post_Type $post_type_object Post type object.
 *
 * @return void
 */
function register_menu( string $post_type, WP_Post_Type $post_type_object ): void {
	if ( ! Catatan\is_post_type_supported( $post_type ) ) {
		return;
	}

	$callback = function () use ( $post_type, $post_type_object ): void {
		$parent = 'edit.php';
		$original_submenu_slug = 'post-new.php';

		if ( $post_type !== 'post' ) {
			$parent = "{$parent}?post_type={$post_type}";
			$original_submenu_slug = "{$original_submenu_slug}?post_type={$post_type}";
		}

		remove_submenu_page( $parent, $original_submenu_slug );

		$hook = add_submenu_page(
			$parent,
			$post_type_object->labels->add_new_item,
			$post_type_object->labels->add_new,
			$post_type_object->cap->create_posts,
			Catatan\get_editor_page_slug( $post_type ),
			__NAMESPACE__ . '\\render_page',
			1
		);

		add_action( "load-{$hook}", fn () => load( $post_type ) );
	};

	add_action( 'admin_menu', $callback );
}

/**
 * Get editor config
 *
 * @param string $post_type Post type name.
 *
 * @return void
 */
function get_config( string $post_type ) {
	$post_type_object = get_post_type_object( $post_type );

	$config = [
		'editor_id' => CATATAN\EDITOR_ID,
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		'post_id' => isset( $_REQUEST['id'] ) ? (int) $_REQUEST['id'] : 0,
		'l10n' => [
			'close_settings' => __( 'Close settings' ),
			'content_region_title' => __( 'Editor content' ),
			'document' => __( 'Document' ),
			'editor_title' => $post_type_object->labels->add_new_item,
			'header_title' => __( 'Editor top bar' ),
			'header_toolbar_title' => __( 'Document tools' ),
			'permalink' => __( 'Permalink' ),
			'preview' => __( 'Preview' ),
			'publish' => __( 'Publish' ),
			'save_draft' => __( 'Save draft' ),
			'settings' => __( 'Settings' ),
			'sidebar_title' => __( 'Editor settings' ),
			'status_panel_title' => __( 'Status & visibility' ),
			'title_input_placeholder' => __( 'Add title' ),
			'url_slug' => __( 'URL Slug' ),
			'visibility' => __( 'Visibility' ),
		],
	];

	/**
	 * Filter editor config
	 *
	 * @since 0.0.1
	 *
	 * @param array $config Editor config.
	 */
	$config = apply_filters( 'catatan__editor_config', $config );

	return $config;
}

/**
 * Load editor page
 *
 * @since 0.0.1
 *
 * @param string $post_type Current post type.
 *
 * @return void
 */
function load( string $post_type ): void {
	enqueue_assets();

	add_action( 'admin_print_scripts', fn () => print_assets( $post_type ) );
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
 * @param string $post_type Current post type.
 *
 * @return void
 */
function print_assets( string $post_type ): void {
	?>
<script>
	var catatanEditor = <?php echo wp_json_encode( get_config( $post_type ) ); ?>;
</script>
<?php // phpcs:disable WordPress.WP.EnqueuedResources.NonEnqueuedScript ?>
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
