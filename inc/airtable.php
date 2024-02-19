<?php

function call_airtable($endpoint) {
  $url = 'https://api.airtable.com/v0' . $endpoint;
  $response = wp_remote_get($url, array(
    'headers' => array(
      'Authorization' => 'Bearer ' . get_field('airtable_api_key', 'options')
    )
  ));

  return json_decode(wp_remote_retrieve_body($response));
}

function c4m_get_bases() {
  $bases = call_airtable('/meta/bases');
  return $bases;
}

function c4m_get_tables() {
  $base_id = get_field('airtable_base', 'options');
  if (!$base_id) {
    return 'must set base id';
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
  $base_id = get_field('airtable_base', 'options');
  $table_id = get_field('table_id', 'options');
  $records = call_airtable('/' . $base_id . '/' . $table_id . '?returnFieldsByFieldId=true');
  return $records;
}