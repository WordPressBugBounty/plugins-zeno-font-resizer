<?php
/*
 * This file will be called when pressing 'Delete' on Dashboard > Plugins.
 */


// if uninstall.php is not called by WordPress, die.
if ( ! defined('WP_UNINSTALL_PLUGIN') ) {
	die();
}

$option_names = array(
		'zeno_font_resizer_letter',
		'zeno_font_resizer',
		'zeno_font_resizer_ownelement',
		'zeno_font_resizer_resizeMax',
		'zeno_font_resizer_resizeMin',
		'zeno_font_resizer_resizeSteps',
		'zeno_font_resizer_cookieTime',
	);

foreach ( $option_names as $option_name ) {

	delete_option( $option_name );

	// for site options in Multisite
	delete_site_option( $option_name );

}
