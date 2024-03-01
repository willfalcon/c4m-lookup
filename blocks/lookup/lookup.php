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

<?php if ($is_preview) : ?>
  <div class="<?php echo $classes; ?>" style="float: none; width:600px; margin-left:auto;margin-right:auto;">
    <div style="border:2px black;border-radius:12px;aspect-ratio:3/2;position:relative;display:flex;flex-direction:column;">
      <div style="padding:12px;">
        <h2 style="font-weight:bold;font-size:24px;line-height:32px;text-align:center;color:white;">
          Look up how your local economy can see a boost by closing the health insurance coverage gap.
        </h2>
      </div>
      <div style="padding:12px;flex: 1 1 0%;">
        <div style="padding:16px;padding-top:48px;padding:48px 32px 16px;z-index:0;">
          <label htmlFor="location-search" style="text-align:center;">
            Start typing your county name:
          </label>
          <div>
            <input
              name="location-search"
              id="location-search"
              style="border-color:black;border-radius:4px;padding:8px 16px;width:100%;"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
<?php else: ?>
  <div class="<?php echo $classes; ?>">
  </div>
<?php endif; ?>