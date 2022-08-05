<?php
declare( strict_types = 1 );

namespace Catatan\Settings;

const OPTION_NAME = 'catatan';
const PAGE_SLUG = OPTION_NAME . '-settings';

/**
 * Settings bootstrapper
 *
 * @since 0.0.1
 *
 * @return void
 */
function bootstrap(): void {
	add_action( 'admin_menu', __NAMESPACE__ . '\\register_menu' );
}

/**
 * Register settings menu
 *
 * @since 0.0.1
 *
 * @return void
 */
function register_menu(): void {
	add_options_page(
		__( 'Catatan Settings', 'catatan' ),
		__( 'Catatan', 'catatan' ),
		'manage_options',
		PAGE_SLUG,
		__NAMESPACE__ . '\\render_page'
	);
}

/**
 * Get settings sections
 *
 * @since 0.0.1
 *
 * @return array
 */
function get_sections(): array {
	return [
		[
			'id' => 'general',
			'title' => __( 'General' ),
		],
	];
}

/**
 * Render settings page
 *
 * @since 0.0.1
 *
 * @return void
 */
function render_page(): void {
	?>
	<h1><?php esc_html_e( 'Catatan Settings', 'catatan' ); ?></h1>

	<ul class="nav-tab-wrapper wp-clearfix" aria-label="<?php esc_attr_e( 'Secondary menu' ); ?>">
		<?php foreach ( get_sections() as $index => $section ) : ?>
			<?php
			printf(
				'<button class="nav-tab %s">%s</button>',
				esc_attr( $index === 0 ? 'nav-tab-active' : '' ),
				esc_html( $section['title'] )
			);
			?>
		<?php endforeach; ?>
	</ul>

	<form action="options.php" method="post">
		<?php submit_button(); ?>
	</form>
	<?php
}
