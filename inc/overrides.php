<?php
declare( strict_types = 1 );

namespace Catatan\Overrides;

use Catatan;

/**
 * Overrides bootstrapper
 *
 * @since 0.0.1
 *
 * @return void
 */
function bootstrap(): void {
	add_filter( 'get_edit_post_link', __NAMESPACE__ . '\\edit_post_link', 10, 3 );
}

/**
 * Override edit post link
 *
 * @since 0.0.1
 *
 * @param string $link    Original edit post link.
 * @param int    $post_id Post ID.
 * @param string $context Link context.
 *
 * @return string
 */
function edit_post_link( string $link, int $post_id, string $context ): string {
	$post_type = get_post_type( $post_id );

	if ( ! ( $post_type && Catatan\is_post_type_supported( $post_type ) ) ) {
		return $link;
	}

	$link = Catatan\get_editor_url( $post_type, $post_id );

	if ( $context === 'display' ) {
		$link = esc_url( $link );
	}

	return $link;
}
