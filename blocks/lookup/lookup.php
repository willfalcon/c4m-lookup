<?php 
  $classes = 'c4m-lookup';

  if ($is_preview) {
    $classes .= ' preview';
  }
  
  if (array_key_exists('align', $block)) {
    $classes .= ' align' . $block['align'];
  }
?>

<div class="<?php echo $classes; ?>">
</div>