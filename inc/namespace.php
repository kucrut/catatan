<?php
declare( strict_types = 1 );

namespace Catatan;

use Catatan\Settings;

const EDITOR_ID = 'catatan-editor';

/**
 * Get editor page slug
 *
 * @since 0.0.1
 *
 * @param string $post_type Post type name.
 * @param bool   $for_edit  Whether to get URL for edit or create action.
 *
 * @return string
 */
function get_editor_page_slug( string $post_type, bool $for_edit = true ): string {
	return sprintf(
		'%s--%s-%s',
		EDITOR_ID,
		$for_edit ? 'edit' : 'new',
		$post_type
	);
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
	$args = [];

	if ( $post_type !== 'post' ) {
		$args['post_type'] = $post_type;
	}

	$args = [ 'page' => get_editor_page_slug( $post_type, $id > 0 ) ];

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
