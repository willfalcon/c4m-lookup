<?php

function call_airtable($endpoint) {
  $key = get_field('airtable_api_key', 'options');
  if (!$key) {
    return new WP_Error(422, 'Airtable Access Token Required.');
  }
  $url = 'https://api.airtable.com/v0' . $endpoint;
  $response = wp_remote_get($url, array(
    'headers' => array(
      'Authorization' => 'Bearer ' . $key
    )
  ));

  return json_decode(wp_remote_retrieve_body($response));
}

function c4m_get_bases() {
  $bases = call_airtable('/meta/bases');
  return $bases;
}

function c4m_get_base_option() {
  $base_id = get_field('airtable_base', 'options');
  if (!$base_id) {
    return new WP_Error(422, 'Must set airtable base.');
  }
  return $base_id;
}

function c4m_get_tables() {
  $base_id = c4m_get_base_option();
  if (is_wp_error($base_id)) {
    return $base_id;
  }
  $bases = call_airtable('/meta/bases/' . $base_id . '/tables');
  return $bases;
}

function c4m_get_table() {
  $tables = c4m_get_tables();
  $table = array_find($tables->tables, function($table) {
		$table_id = get_field('table_id', 'options');
		return $table->id == $table_id;
	});
  return $table;
}

function c4m_get_table_records() {
  $base_id = c4m_get_base_option();
  if (is_wp_error($base_id)) {
    return $base_id;
  }
  $table_id = get_field('table_id', 'options');
  if (!$table_id) {
    return new WP_Error('422', 'Must set airtable table.');
  }
  $records = call_airtable('/' . $base_id . '/' . $table_id . '?returnFieldsByFieldId=true');
  return $records;
}