<?php
declare( strict_types = 1 );

namespace Catatan\Admin_Menu;

use Catatan;
use Catatan\Settings;
use WP_Post_Type;

/**
 * Admin menu bootstrapper
 *
 * @since 0.0.1
 *
 * @return void
 */
function bootstrap(): void {
	add_action( 'registered_post_type', __NAMESPACE__ . '\\replace_add_new_submenu', 10, 2 );
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
function replace_add_new_submenu( string $post_type, WP_Post_Type $post_type_object ): void {
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

		add_submenu_page(
			$parent,
			$post_type_object->labels->add_new_item,
			$post_type_object->labels->add_new,
			$post_type_object->cap->create_posts,
			Catatan\get_editor_page_slug( $post_type ),
			'\\Catatan\\Editor\\render_page',
			1
		);

		remove_submenu_page( $parent, $original_submenu_slug );
	};

	add_action( 'admin_menu', $callback );
}
