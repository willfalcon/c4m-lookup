<?php


if ( ! function_exists('write_log')) {
  function write_log ( $log )  {
		if (empty($log)) {
			error_log('');
		} else if ( is_array( $log ) || is_object( $log ) ) {
			error_log( print_r( $log, true ) );
		} else {
			error_log( $log);
		}
  }
}