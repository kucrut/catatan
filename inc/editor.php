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

	add_action( 'admin_menu', fn () => register_page( $post_type_object ) );
	add_action( 'admin_menu', fn () => register_page( $post_type_object, false ) );
}

/**
 * Register page
 *
 * @since 0.0.1
 *
 * @param WP_Post_Type $post_type Post type object.
 * @param bool         $for_edit  Whether to register page for edit or create action.
 *
 * @return void
 */
function register_page( WP_Post_Type $post_type, bool $for_edit = true ): void {
	$parent = 'edit.php';
	$original_submenu_slug = 'post-new.php';

	if ( $post_type->name !== 'post' ) {
		$parent = "{$parent}?post_type={$post_type->name}";
		$original_submenu_slug = "{$original_submenu_slug}?post_type={$post_type->name}";
	}

	$page_slug = Catatan\get_editor_page_slug( $post_type->name, $for_edit );
	$hook_suffix = add_submenu_page(
		$parent,
		$post_type->labels->{ $for_edit ? 'edit_item' : 'add_new_item' },
		$post_type->labels->{ $for_edit ? 'edit_item' : 'add_new' },
		$post_type->cap->create_posts,
		$page_slug,
		__NAMESPACE__ . '\\render_page',
		1
	);

	if ( $for_edit ) {
		// We don't want our edit page to be added to the menu.
		remove_submenu_page( $parent, $page_slug );
	} else {
		// We want to replace core's "Add new" sub menu.
		remove_submenu_page( $parent, $original_submenu_slug );
	}

	add_action( "load-{$hook_suffix}", fn () => load( $post_type, $for_edit ) );
}

/**
 * Get editor config
 *
 * @param WP_Post_Type $post_type Post type object.
 *
 * @return array
 */
function get_config( WP_Post_Type $post_type ): array {
	$config = [
		'editor_id' => CATATAN\EDITOR_ID,
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		'post_id' => isset( $_REQUEST['id'] ) ? (int) $_REQUEST['id'] : 0,
		'l10n' => [
			'close_settings' => __( 'Close settings' ),
			'content_region_title' => __( 'Editor content' ),
			'document' => __( 'Document' ),
			'editor_title' => $post_type->labels->add_new_item,
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
 * @param WP_Post_Type $post_type Current post type object.
 * @param bool         $is_edit   Are we loading the edit page?
 *
 * @return void
 */
function load( WP_Post_Type $post_type, bool $is_edit = true ): void {
	/**
	 * Fire before the load actions are run
	 *
	 * @since 0.0.1
	 *
	 * @param WP_Post_Type $post_type Current post type object.
	 * @param bool         $is_edit  Are we loading the edit page?
	 */
	do_action( 'catatan__before_load_editor', $post_type, $is_edit );

	check_permission( $post_type, $is_edit );
	enqueue_assets();

	add_action( 'admin_print_scripts', fn () => print_assets( $post_type ) );

	if ( $is_edit ) {
		// Bacuse we've removed the page from admin menus, WP does not have the page title anymore, so we need to fix it here.
		add_filter( 'admin_title', fn ( string $admin_title ): string => "{$post_type->labels->edit_item} {$admin_title}" );
	}

	/**
	 * Fire after the load actions are run
	 *
	 * @since 0.0.1
	 *
	 * @param WP_Post_Type $post_type Current post type object.
	 * @param bool         $is_edit  Are we loading the edit page?
	 */
	do_action( 'catatan__after_load_editor', $post_type, $is_edit );
}


/**
 * Check permission
 *
 * @since 0.0.1
 *
 * @param WP_Post_Type $post_type Current post type object.
 * @param bool         $is_edit   Is this the edit page?
 *
 * @return void
 */
function check_permission( WP_Post_Type $post_type, bool $is_edit = true ): void {
	if ( ! current_user_can( $post_type->cap->edit_posts ) || ! current_user_can( $post_type->cap->create_posts ) ) {
		wp_die(
			'<h1>' . esc_html__( 'You need a higher level of permission.' ) . '</h1>' .
			'<p>' . esc_html__( 'Sorry, you are not allowed to create posts as this user.' ) . '</p>',
			403
		);
	}

	if ( ! $is_edit ) {
		return;
	}

	if ( ! isset( $_GET['id'] ) ) {
		wp_safe_redirect( Catatan\get_editor_url( $post_type->name ), 302, 'Catatan' );
		exit;
	}
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
 * @param WP_Post_Type $post_type Current post type object.
 *
 * @return void
 */
function print_assets( WP_Post_Type $post_type ): void {
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
