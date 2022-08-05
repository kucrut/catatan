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
