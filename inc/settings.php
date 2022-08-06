<?php
declare( strict_types = 1 );

namespace Catatan\Settings;

const OPTION_NAME_PREFIX = 'catatan';
const PAGE_SLUG = 'writing';

/**
 * Settings bootstrapper
 *
 * @since 0.0.1
 *
 * @return void
 */
function bootstrap(): void {
	add_action( 'admin_init', __NAMESPACE__ . '\\register_sections_and_fields' );
}

/**
 * Generate option name
 *
 * @since 0.0.1
 *
 * @param string $id Field ID.
 *
 * @return string
 */
function generate_option_name( string $id ): string {
	return sprintf( '%s__%s', OPTION_NAME_PREFIX, $id );
}

/**
 * Get option value
 *
 * @since 0.0.1
 *
 * @param string $id Field ID.
 *
 * @return mixed
 */
function get_value( string $id ) {
	return get_option( generate_option_name( $id ) );
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
			'id' => OPTION_NAME_PREFIX,
			'title' => 'Catatan',
		],
	];
}

/**
 * Get settings fields
 *
 * @since 0.0.1
 *
 * @return array Array of fields data.
 */
function get_fields(): array {
	return [
		[
			'callback' => __NAMESPACE__ . '\\render_field_post_types',
			'id' => generate_option_name( 'post_types' ),
			'section' => OPTION_NAME_PREFIX,
			'title' => __( 'Supported post types', 'catatan' ),
			'args' => [
				'default' => [],
				'description' => __( 'Post types supported by Catatan', 'catatan' ),
				'sanitize_callback' => __NAMESPACE__ . '\\sanitize_post_types',
				'type' => 'array',
				'show_in_rest' => [
					'name' => generate_option_name( 'post_types' ),
					'schema' => [
						'type' => 'array',
						'items' => [ 'type' => 'string' ],
					],
				],
			],
		],
	];
}

/**
 * Register settings sections and fields
 *
 * @since 0.0.1
 *
 * @return void
 */
function register_sections_and_fields(): void {
	foreach ( get_sections() as $section ) {
		add_settings_section( $section['id'], $section['title'], '', PAGE_SLUG );
	}

	foreach ( get_fields() as $field ) {
		register_setting(
			PAGE_SLUG,
			$field['id'],
			$field['args']
		);

		add_settings_field(
			$field['id'],
			$field['title'],
			$field['callback'],
			PAGE_SLUG,
			$field['section'],
			[ 'id' => $field['id'] ]
		);
	}
}

/**
 * Render field: Post types
 *
 * @since 0.0.1
 *
 * @param array $args Arguments passed by add_settings_field().
 *
 * @return void
 */
function render_field_post_types( array $args ): void {
	$post_types = get_post_types(
		[
			'show_in_menu' => true,
			'show_ui' => true,
		],
		'objects'
	);

	unset( $post_types['attachment'] );

	if ( empty( $post_types ) ) {
		printf( '<p>%s</p>', esc_html__( 'No post types found.', 'catatan' ) );
		return;
	}

	$value = get_option( $args['id'] );
	?>
	<fieldset>
		<legend class="screen-reader-text"><span><?php esc_html_e( 'Post types', 'catatan' ); ?></span></legend>
		<?php
		foreach ( $post_types as $post_type_object ) {
			printf(
				'<div><label><input type="checkbox" name="%s[]" value="%s"%s /> %s</label></div>',
				esc_attr( $args['id'] ),
				esc_attr( $post_type_object->name ),
				checked( in_array( $post_type_object->name, $value, true ), true, false ),
				esc_html( $post_type_object->label )
			);
		}
		?>
	</fieldset>
	<?php
}

/**
 * Sanitize value: post_types
 *
 * @since 0.0.1
 *
 * @param mixed $value Value to save.
 *
 * @return array
 */
function sanitize_post_types( $value ): array {
	if ( ! is_array( $value ) ) {
		return [];
	}

	return array_filter(
		$value,
		function ( $post_type ): bool {
			if ( ! is_string( $post_type ) ) {
				return false;
			}

			$post_type_object = get_post_type_object( $post_type );

			if ( ! $post_type_object ) {
				return false;
			}

			if ( ! ( $post_type_object->show_in_menu && $post_type_object->show_ui ) ) {
				return false;
			}

			return true;
		}
	);
}
