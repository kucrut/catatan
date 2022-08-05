<?php
/**
 * Plugin Name: Catatan
 * Description: Write content with editor of your choice.
 * Author: Dzikri Aziz
 * Author URI: https://dz.aziz.im
 * Version: 0.0.0
 */

declare( strict_types = 1 );

namespace Catatan;

require_once __DIR__ . '/inc/admin-menu.php';
require_once __DIR__ . '/inc/editor.php';
require_once __DIR__ . '/inc/namespace.php';
require_once __DIR__ . '/inc/settings.php';

Admin_Menu\bootstrap();
Editor\bootstrap();
Settings\bootstrap();
