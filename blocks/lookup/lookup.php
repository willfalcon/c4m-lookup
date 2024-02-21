<?php 
  $classes = 'c4m-lookup';

  if ($is_preview) {
    $classes .= ' preview';
  }
  
  if (array_key_exists('align', $block)) {
    $classes .= ' align' . $block['align'];
  }

  if (current_user_can('manage_options')) {
    $classes .= ' admin-caps';
  }
?>

<div class="<?php echo $classes; ?>">
</div>