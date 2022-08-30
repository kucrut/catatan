<?php
declare( strict_types = 1 );

namespace Catatan\Editor;

use Catatan;
use Kucrut\Vite;
use WP_Block_Editor_Context;
use WP_Post;
use WP_Post_Type;

/**
 * Editor bootstrapper
 *
 * @since 0.1.0
 *
 * @return void
 */
function bootstrap(): void {
	add_action( 'registered_post_type', __NAMESPACE__ . '\\register_menu', 10, 2 );
}

/**
 * Replace post type's "Add new" submenu
 *
 * @since 0.1.0
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

	add_action( 'admin_menu', fn () => register_page( $post_type_object, true ) );
	add_action( 'admin_menu', fn () => register_page( $post_type_object, false ) );
}

/**
 * Register page
 *
 * @since 0.1.0
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
		$post_type->cap->{ $for_edit ? 'edit_posts' : 'create_posts' },
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
 * Get post ID being edited
 *
 * @since 0.1.0
 *
 * @return int|null Post ID or null if not found or invalid.
 */
function get_post_id(): ?int {
	$post_id = null;

	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	if ( ! isset( $_GET['id'] ) ) {
		return $post_id;
	}

	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$found_id = (int) $_GET['id'];

	if ( $found_id > 0 ) {
		$post_id = $found_id;
	}

	return $post_id;
}

/**
 * Get editor config
 *
 * @param WP_Post      $post      Current post object being edited.
 * @param WP_Post_Type $post_type Post type object.
 *
 * @return array
 */
function get_config( WP_Post $post, WP_Post_Type $post_type ): array {
	$post_list_url = admin_url( 'edit.php' );

	if ( $post_type->name !== 'post' ) {
		$post_list_url = add_query_arg( [ 'post_type' => $post_type->name ], $post_list_url );
	}

	$config = [
		'edit_link' => get_edit_post_link( $post->ID, 'db' ),
		'editor_id' => CATATAN\EDITOR_ID,
		'post_id' => $post->ID,
		'post_list_url' => $post_list_url,
		'post_rest_path' => rest_get_route_for_post_type_items( $post->post_type ),
		'post_type' => $post_type->name,
		'post_type_rest_path' => sprintf( '/wp/v2/types/%s?context=edit', $post->post_type ),
	];

	/**
	 * Filter editor config
	 *
	 * @since 0.1.0
	 *
	 * @param array        $config    Editor config.
	 * @param WP_Post      $post      Current post object being edited.
	 * @param WP_Post_Type $post_type Post type object.
	 */
	$config = apply_filters( 'catatan__editor_config', $config, $post, $post_type );

	return $config;
}

/**
 * Load editor page
 *
 * @since 0.1.0
 *
 * @todo Provide page title templates for new & edit screens.
 *
 * @param WP_Post_Type $post_type Current post type object.
 * @param bool         $is_edit   Are we loading the edit page?
 *
 * @return void
 */
function load( WP_Post_Type $post_type, bool $is_edit = true ): void {
	if ( ! current_user_can( $post_type->cap->edit_posts ) || ! current_user_can( $post_type->cap->create_posts ) ) {
		wp_die(
			'<h1>' . esc_html__( 'You need a higher level of permission.' ) . '</h1>' .
			'<p>' . esc_html__( 'Sorry, you are not allowed to create posts as this user.' ) . '</p>',
			403
		);
	}

	$post_id = get_post_id();

	if ( $is_edit ) {
		// Ensure we're on the correct page.
		if ( empty( $post_id ) ) {
			wp_safe_redirect( Catatan\get_editor_url( $post_type->name ), 302, 'Catatan' );
			exit;
		}

		$post = get_post( $post_id );

		if ( empty( $post ) ) {
			wp_die( esc_html__( 'You attempted to edit an item that does not exist. Perhaps it was deleted?' ) );
		}
	} else {
		$post = get_default_post_to_edit( $post_type->name, true );
	}

	if ( $post->post_type !== $post_type->name ) {
		wp_die(
			esc_html__( 'A post type mismatch has been detected.' ),
			esc_html__( 'Sorry, you are not allowed to edit this item.' ),
			400
		);
	}

	if ( ! current_user_can( 'edit_post', $post->ID ) ) {
		wp_die( esc_html__( 'Sorry, you are not allowed to edit this item.' ) );
	}

	if ( 'trash' === $post->post_status ) {
		wp_die( esc_html__( 'You cannot edit this item because it is in the Trash. Please restore it and try again.' ) );
	}

	/**
	 * Fire before the load actions are run
	 *
	 * @since 0.1.0
	 *
	 * @param WP_Post      $post      Current post object being edited.
	 * @param WP_Post_Type $post_type Current post type object.
	 * @param bool         $is_edit   Are we loading the edit page?
	 */
	do_action( 'catatan__before_load_editor', $post, $post_type, $is_edit );

	enqueue_assets( $post, $post_type );
	preload_data( $post );

	if ( $is_edit ) {
		// Because we've removed the page from admin menus, WP does not have the page title anymore, so we need to fix it here.
		add_filter( 'admin_title', fn ( string $admin_title ): string => "{$post_type->labels->edit_item} {$admin_title}" );
	}

	/**
	 * Fire after the load actions are run
	 *
	 * @since 0.1.0
	 *
	 * @param WP_Post_Type $post_type Current post type object.
	 * @param bool         $is_edit  Are we loading the edit page?
	 */
	do_action( 'catatan__after_load_editor', $post_type, $is_edit );
}

/**
 * Enqueue assets
 *
 * @since 0.1.0
 *
 * @param WP_Post      $post      Current post object being edited.
 * @param WP_Post_Type $post_type Current post type object.
 *
 * @return void
 */
function enqueue_assets( WP_Post $post, WP_Post_Type $post_type ): void {
	wp_enqueue_global_styles_css_custom_properties();

	Vite\enqueue_asset(
		dirname( __DIR__ ) . '/app/dist',
		'app/src/main.ts',
		[
			'css-dependencies' => [ 'wp-components', 'wp-edit-post' ],
			'dependencies' => [ 'wp-api-fetch', 'wp-i18n' ],
			'handle' => Catatan\EDITOR_ID,
			'in-footer' => true,
		]
	);

	wp_add_inline_script(
		Catatan\EDITOR_ID,
		// phpcs:ignore WordPress.WP.AlternativeFunctions.json_encode_json_encode
		sprintf( 'var catatanEditor = %s;', json_encode( get_config( $post, $post_type ) ) ),
		'before'
	);
}

/**
 * Preload data
 *
 * @since 0.1.0
 *
 * @param WP_Post $post Current post object being edited.
 *
 * @return void
 */
function preload_data( WP_Post $post ): void {
	$post_route = add_query_arg( 'context', 'edit', rest_get_route_for_post( $post ) );

	// Preload common data.
	$preload_paths = [
		sprintf( '/wp/v2/types/%s?context=edit', $post->post_type ),
		sprintf( '/wp/v2/taxonomies?context=edit&type=%s', $post->post_type ),
		$post_route,
		[ $post_route, 'OPTIONS' ],
	];

	block_editor_rest_api_preload(
		$preload_paths,
		new WP_Block_Editor_Context(
			[
				'name' => 'catatan/edit-post',
				'post' => $post,
			]
		)
	);
}

/**
 * Render editor page
 *
 * @since 0.1.0
 *
 * @return void
 */
function render_page(): void {
	printf( '<div id="%s"></div>', esc_attr( CATATAN\EDITOR_ID ) );
}
