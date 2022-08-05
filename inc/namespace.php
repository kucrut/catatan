<?php
declare( strict_types = 1 );

namespace Catatan;

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
