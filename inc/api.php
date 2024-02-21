<?php

add_action( 'rest_api_init', function () {
  register_rest_route( 'airtable/v1', '/bases', array(
    'methods' => \WP_REST_Server::READABLE,
    'callback' => 'c4m_get_bases',
    'permission_callback' => '__return_true'
  ));
  register_rest_route( 'lookup/v1', '/data', array(
    'methods' => \WP_REST_Server::READABLE,
    'callback' => 'c4m_get_lookup_data',
    'permission_callback' => '__return_true'
  ));

});

function c4m_get_lookup_data() {
  $data = new stdClass();
  
  $records = c4m_get_table_records();
  if (is_wp_error($records)) {
    return $records;
  }
  $data->records = $records->records;

  $search_field = get_field('search_field', 'options');
  if (!$search_field) {
    return new WP_Error(422, 'Must set search field.');
  }
  $data->settings = new stdClass();
  $data->settings->searchField = $search_field;
  
  $care_reduction = get_field('care_reduction', 'options');
  $jobs = get_field('jobs_field', 'options');
  $tax_revenue = get_field('tax_revenue', 'options');

  $data->settings->careReduction = $care_reduction;
  $data->settings->jobs = $jobs;
  $data->settings->taxRevenue = $tax_revenue;

  return $data;
  
}