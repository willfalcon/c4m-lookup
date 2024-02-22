<?php
/*
  Plugin Name: Care4Mississippi Data Lookup
  Plugin URI: https://care4mississippi.org
  Version: 0.0.4
  Author: Creative Distillery
  Author URI: https://creativedistillery.com
*/


/**
 * Add Block Category
 */
function cdhq_add_block_category( $categories, $post ) {
	return array_merge(
		array(
			array(
				'slug' => 'cdhq',
				'title' => __('Care4Mississippi Lookup', 'c4m-lookup'),
			)
		),
		$categories
	);
}
add_filter( 'block_categories_all', 'cdhq_add_block_category', 10, 2);


/**
 * Register all custom blocks for theme
 * Hooked into 'init'
 */

 if( !function_exists('get_plugin_data') ){
    require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
}

if (!function_exists('cdhq_plugin_version')) {
  function cdhq_plugin_version() {
    $ver = get_plugin_data( plugin_dir_path( __FILE__ ) . 'c4m-lookup.php' )['Version'];
    return $ver;
  }
}

function cdhq_register_blocks() {
	$blocks = get_blocks();

	$ver = cdhq_plugin_version();
	$env = wp_get_environment_type();
	$base = plugin_dir_path( __FILE__ ) . 'blocks/';
	$is_dev = $env == 'development' || $env == 'local';

	// wp_register_script('luxon', 'https://cdn.jsdelivr.net/npm/luxon@3.4.3/build/global/luxon.min.js', array(), null, true);
	// wp_register_style('tabulator-style', 'https://unpkg.com/tabulator-tables/dist/css/tabulator_materialize.min.css');

	if ($env == 'development' || $env == 'local') {
		// wp_register_style( 'swiper_styles', get_template_directory_uri() . '/dist/swiper-bundle.css', array(), $ver );
	} else {
		// wp_register_style( 'swiper_styles', get_template_directory_uri() . '/dist/swiper-bundle.min.css', array(), $ver );
	}
	foreach ($blocks as $block) {
		$block_base = $base . $block;
		
		$dist_base = plugin_dir_url( __FILE__ ) . 'dist/' . $block . '/' . $block;
		
		if (file_exists($block_base . '/block.json')) {
			$block_json = json_decode(file_get_contents($block_base . '/block.json'));
			$dependencies = property_exists($block_json, 'dependencies') ? $block_json->dependencies : false;

			register_block_type($block_base);
			if (file_exists($block_base . '/' . $block . '.scss')) {
				$deps = array();
				if ($dependencies && property_exists($dependencies, 'style')) {
					$deps = $dependencies->style;
				}
				wp_register_style($block . '-style', $is_dev ? $dist_base . '.css' : $dist_base . '.min.css', $deps, $ver);
			}
			if (file_exists($block_base . '/' . $block . '-editor.scss')) {
				$deps = array();
				if ($dependencies && property_exists($dependencies, 'editorStyle')) {
					$deps = $dependencies->editorStyle;
				}
				wp_register_style($block . '-editor-style', $is_dev ? $dist_base . '-editor.css' : $dist_base . '-editor.min.css', $deps, $ver);
			}
			if (file_exists($block_base . '/' . $block . '.js')) {
				$deps = array();
				if ($dependencies && property_exists($dependencies, 'script')) {
					$deps = $dependencies->script;
				}
				wp_register_script($block . '-script', $is_dev ? $dist_base . '.js' : $dist_base . '.min.js', $deps, $ver, true);
			}
			if (file_exists($block_base . '/' . $block . '-editor.js')) {
				$deps = array();
				if ($dependencies && property_exists($dependencies, 'editorScript')) {
					$deps = $dependencies->editorScript;
				}
				wp_register_script($block . '-editor-script', $is_dev ? $dist_base . '-editor.js' : $dist_base . '-editor.min.js', $deps, $ver, true);
			}
		}
	}
}


function get_blocks() {
	$theme = wp_get_theme();
	$blocks = get_option('cdhq_blocks');
	$version = get_option('cdhq_blocks_version');
	if (empty($blocks) || version_compare(cdhq_plugin_version(), $version) || (function_exists( 'wp_get_environment_type' ) && 'production' !== wp_get_environment_type())) {
		$blocks = scandir(plugin_dir_path( __FILE__ ) . 'blocks/' );
		$blocks = array_values(array_diff($blocks, array('..', '.', '.DS_Store', '_base-block', '_block-import.scss', 'counties.js', 'utils.js')));
		
		update_option('cdhq_blocks', $blocks);
		update_option('cdhq_blocks_version', cdhq_plugin_version());
	}
	return $blocks;
}


add_action('init', 'cdhq_register_blocks', 5);

function cc4m_enqueue_assets() {
	$env = wp_get_environment_type();
	if ($env == 'development' || $env == 'local') {
    wp_enqueue_script( 'fontawesome-solid', get_template_directory_uri() . '/inc/fontawesome/solid.js', array(), false, true );
    wp_enqueue_script( 'fontawesome-fontawesome', get_template_directory_uri() . '/inc/fontawesome/fontawesome.js', array(), false, true );
	} else {
    wp_enqueue_script( 'fontawesome-solid', get_template_directory_uri() . '/inc/fontawesome/solid.min.js', array(), false, true );
    wp_enqueue_script( 'fontawesome-fontawesome', get_template_directory_uri() . '/inc/fontawesome/fontawesome.min.js', array(), false, true );
	}
}
// add_action( 'wp_enqueue_scripts', 'cc4m_enqueue_assets' ); 


include_once(plugin_dir_path( __FILE__ ) . 'inc/utils.php');
include_once(plugin_dir_path( __FILE__ ) . 'inc/airtable.php');
include_once(plugin_dir_path( __FILE__ ) . 'inc/api.php');
include_once(plugin_dir_path( __FILE__ ) . 'inc/require-plugins.php');
include_once(plugin_dir_path( __FILE__ ) . 'inc/debugging.php');


function set_base_options($field) {
	$bases = c4m_get_bases();
	$field['choices'][''] = '';
	foreach($bases->bases as $base) {
		$field['choices'][$base->id] = $base->name;
	}
	return $field;
}
add_filter('acf/load_field/name=airtable_base', 'set_base_options');



function set_table_options($field) {
	$tables = c4m_get_tables();

	if (is_wp_error($tables)) {
		$field['choices'][''] = $tables->errors[422][0];
		return $field;
	}

	$field['choices'][''] = '';
	foreach($tables->tables as $table) {
		$field['choices'][$table->id] = $table->name;
	}

	return $field;
}
add_filter('acf/load_field/name=table_id', 'set_table_options');



function c4m_set_column_options($field) {
	$tables = c4m_get_tables();
	if (is_wp_error($tables)) {
		$field['choices'][''] = $tables->errors[422][0];
		return $field;
	}

	$table_id = get_field('table_id', 'options');
	if (!$table_id) {
		$field['choices'][''] = 'Must set airtable table.';
		return $field;
	}

	$table = array_find($tables->tables, function($table) {
		$table_id = get_field('table_id', 'options');
		return $table->id == $table_id;
	});

	$field['choices'][''] = '';
	foreach($table->fields as $tablefield) {
		$field['choices'][$tablefield->id] = $tablefield->name;
	}
	return $field;
}

add_filter('acf/load_field/name=airtable_column', 'c4m_set_column_options');
add_filter('acf/load_field/name=search_field', 'c4m_set_column_options');


function acf_icon_select_choices( $field ) {
  $field['choices'] = array(
    'none' => 'None',
		'briefcase' => 'Brief Case',
		'hospital' => 'Hospital',
		'trafficcone' => 'Traffic Cone'
  );
  // return the field
  return $field;
}

add_filter('acf/load_field/name=icon_select', 'acf_icon_select_choices');
