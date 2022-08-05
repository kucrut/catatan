<?php
declare( strict_types = 1 );

namespace Catatan;

use Catatan\Settings;

/**
 * Get editor page slug
 *
 * @since 0.0.1
 *
 * @param string $post_type Post type name.
 *
 * @return string
 */
function get_editor_page_slug( string $post_type ): string {
	return "catatan--{$post_type}";
}

/**
 * Get editor URL
 *
 * @since 0.0.1
 *
 * @param string $post_type Post type name.
 * @param int    $id        Post ID (optional).
 *
 * @return string
 */
function get_editor_url( string $post_type, int $id = 0 ): string {
	$args = [ 'page' => get_editor_page_slug( $post_type ) ];

	if ( $post_type !== 'post' ) {
		$args = array_merge(
			[ 'post_type' => $post_type ],
			$args
		);
	}

	if ( $id > 0 ) {
		$args['id'] = $id;
	}

	return add_query_arg( $args, admin_url( 'edit.php' ) );
}

/**
 * Check if post type is supported
 *
 * @since 0.0.1
 *
 * @param string $post_type Post type name to check.
 *
 * @return bool
 */
function is_post_type_supported( string $post_type ): bool {
	$supported = Settings\get_value( 'post_types' );

	if ( empty( $supported ) ) {
		return false;
	}

	return in_array( $post_type, $supported, true );
}
