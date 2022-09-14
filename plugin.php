<?php
/**
 * Plugin Name: Catatan
 * Description: Simple post editor for WordPress.
 * Author: Dzikri Aziz
 * Author URI: https://dz.aziz.im
 * Version: 0.1.2
 * Text Domain: catatan
 */

declare( strict_types = 1 );

namespace Catatan;

if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

require_once __DIR__ . '/inc/editor.php';
require_once __DIR__ . '/inc/namespace.php';
require_once __DIR__ . '/inc/overrides.php';
require_once __DIR__ . '/inc/settings.php';

Editor\bootstrap();
Overrides\bootstrap();
Settings\bootstrap();
