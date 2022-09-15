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
	add_action( 'admin_menu', __NAMESPACE__ . '\\register_menu' );
}

/**
 * Register admin menus
 *
 * This adds the edit screen for each supported post types and replaces core's "Add new" submenu.
 *
 * @since 0.1.0
 *
 * @return void
 */
function register_menu(): void {
	foreach ( get_post_types( [], 'names' ) as $post_type ) {
		if ( Catatan\is_post_type_supported( $post_type ) ) {
			register_page( $post_type, true );
			register_page( $post_type, false );
		}
	}
}

/**
 * Register page
 *
 * @since 0.1.0
 *
 * @param string $post_type Post type name.
 * @param bool   $for_edit  Whether to register page for edit or create action.
 *
 * @return void
 */
function register_page( string $post_type, bool $for_edit = true ): void {
	$parent = 'edit.php';
	$original_submenu_slug = 'post-new.php';

	if ( $post_type !== 'post' ) {
		$parent = "{$parent}?post_type={$post_type}";
		$original_submenu_slug = "{$original_submenu_slug}?post_type={$post_type}";
	}

	$pt_object = get_post_type_object( $post_type );

	$page_slug = Catatan\get_editor_page_slug( $post_type, $for_edit );
	$hook_suffix = add_submenu_page(
		$parent,
		$pt_object->labels->{ $for_edit ? 'edit_item' : 'add_new_item' },
		$pt_object->labels->{ $for_edit ? 'edit_item' : 'add_new' },
		$pt_object->cap->{ $for_edit ? 'edit_posts' : 'create_posts' },
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
 * Get alignment settings
 *
 * @since 0.1.0
 *
 * @return array
 */
function get_alignment_settings(): array {
	return [
		'none' => __( 'None' ),
		'left' => __( 'Left' ),
		'center' => __( 'Center' ),
		'right' => __( 'Right' ),
	];
}

/**
 * Get image settings
 *
 * @since 0.1.0
 *
 * @return array
 */
function get_image_settings(): array {
	$image_size_names = apply_filters(
		'image_size_names_choose',
		array(
			'thumbnail' => __( 'Thumbnail' ),
			'medium'    => __( 'Medium' ),
			'large'     => __( 'Large' ),
			'full'      => __( 'Full Size' ),
		)
	);

	$default_size       = get_option( 'image_default_size', 'large' );
	$image_default_size = in_array( $default_size, array_keys( $image_size_names ), true ) ? $default_size : 'large';

	return [
		'image_default_size' => $image_default_size,
		'image_size_names' => $image_size_names,
	];
}

/**
 * Get editor config
 *
 * @param WP_Post $post Current post object being edited.
 *
 * @return array
 */
function get_config( WP_Post $post ): array {
	$post_list_url = admin_url( 'edit.php' );

	if ( $post->post_type !== 'post' ) {
		$post_list_url = add_query_arg( [ 'post_type' => $post->post_type ], $post_list_url );
	}

	$config = array_merge(
		[
			'block_alignments' => get_alignment_settings(),
			'edit_link' => get_edit_post_link( $post->ID, 'db' ),
			'editor_id' => CATATAN\EDITOR_ID,
			'media_rest_route' => rest_get_route_for_post_type_items( 'attachment' ),
			'post_id' => $post->ID,
			'post_list_url' => $post_list_url,
			'post_rest_route' => rest_get_route_for_post_type_items( $post->post_type ),
			'post_type' => $post->post_type,
			'post_type_rest_route' => sprintf( '/wp/v2/types/%s', $post->post_type ),
		],
		get_image_settings()
	);

	/**
	 * Filter editor config
	 *
	 * @since 0.1.0
	 *
	 * @param array $config Editor config.
	 * @param int   $post   Current post ID being edited.
	 */
	$config = apply_filters( 'catatan__editor_config', $config, $post->ID );

	return $config;
}

/**
 * Load editor page
 *
 * @since 0.1.0
 *
 * @todo Provide page title templates for new & edit screens.
 *
 * @param string $post_type Current post type name.
 * @param bool   $is_edit   Are we loading the edit page?
 *
 * @return void
 */
function load( string $post_type, bool $is_edit = true ): void {
	$pt_object = get_post_type_object( $post_type );

	if ( ! current_user_can( $pt_object->cap->edit_posts ) || ! current_user_can( $pt_object->cap->create_posts ) ) {
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
			wp_safe_redirect( Catatan\get_editor_url( $post_type ), 302, 'Catatan' );
			exit;
		}

		$post = get_post( $post_id );

		if ( empty( $post ) ) {
			wp_die( esc_html__( 'You attempted to edit an item that does not exist. Perhaps it was deleted?' ) );
		}
	} else {
		$post = get_default_post_to_edit( $post_type, true );
	}

	if ( $post->post_type !== $post_type ) {
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
	 * @param int  $post_id Current post ID being edited.
	 * @param bool $is_edit Are we loading the edit page?
	 */
	do_action( 'catatan__before_load_editor', $post->ID, $is_edit );

	add_action( 'admin_enqueue_scripts', fn () => enqueue_assets( $post->ID ) );
	add_filter( 'admin_body_class', fn ( string $classes ) => "{$classes} catatan-editor-page" );

	if ( $is_edit ) {
		$pt_object = get_post_type_object( $post_type );
		// Because we've removed the page from admin menus, WP does not hav
		add_filter( 'admin_title', fn ( string $admin_title ): string => "{$pt_object->labels->edit_item} {$admin_title}" );
	}

	/**
	 * Fire after the load actions are run
	 *
	 * @since 0.1.0
	 *
	 * @param int  $post_id Current post ID being edited.
	 * @param bool $is_edit Are we loading the edit page?
	 */
	do_action( 'catatan__after_load_editor', $post->ID, $is_edit );
}

/**
 * Enqueue assets
 *
 * @since 0.1.0
 *
 * @param int $post_id Current post ID being edited.
 *
 * @return void
 */
function enqueue_assets( int $post_id ): void {
	$post = get_post( $post_id );

	if ( ! $post ) {
		return;
	}

	preload_data( $post );
	wp_enqueue_global_styles_css_custom_properties();
	wp_enqueue_media( [ 'post' => $post ] );

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
		sprintf( 'var catatanEditor = %s;', json_encode( get_config( $post ) ) ),
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
		$post_route,
		[ $post_route, 'OPTIONS' ],
	];

	$taxonomies = get_taxonomies( [ 'object_type' => [ $post->post_type ] ] );

	if ( ! empty( $taxonomies ) ) {
		$preload_paths[] = sprintf( '/wp/v2/taxonomies?context=edit&type=%s', $post->post_type );
	}

	$featured_image_id = get_post_thumbnail_id( $post );

	if ( $featured_image_id ) {
		$preload_paths[] = rest_get_route_for_post( $featured_image_id );
	}

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
