<?php

//reload options to be sure correct options are displayed
$this->_options = get_option('utubevideo_main_opts');

//get current tab action
$action = '';

if (isset($_GET['action']))
{
  //filter action, if invalid show general settings
  if ($_GET['action'] == 'youtube')
    $action = 'youtube';
  elseif ($_GET['action'] == 'vimeo')
    $action = 'vimeo';
  elseif ($_GET['action'] == 'status')
    $action = 'status';
}

?>

<div class="wrap utv-admin" id="utv-settings">
  <h2 id="utv-masthead">uTubeVideo <?php _e('Settings', 'utvg'); ?></h2>
  <h2 class="nav-tab-wrapper">
    <a href="?page=utubevideo_settings" class="nav-tab <?php echo ($action == '' ? 'nav-tab-active' : ''); ?>"><?php _e('General', 'utvg'); ?></a>
    <a href="?page=utubevideo_settings&action=youtube" class="nav-tab <?php echo ($action == 'youtube' ? 'nav-tab-active' : ''); ?>"><?php _e('YouTube', 'utvg'); ?></a>
    <a href="?page=utubevideo_settings&action=vimeo" class="nav-tab <?php echo ($action == 'vimeo' ? 'nav-tab-active' : ''); ?>"><?php _e('Vimeo', 'utvg'); ?></a>
    <a href="?page=utubevideo_settings&action=status" class="nav-tab <?php echo ($action == 'status' ? 'nav-tab-active' : ''); ?>"><?php _e('Status', 'utvg'); ?></a>
  </h2>
  <div class="utv-fullwidth-column">
    <div class="utv-formbox utv-top-formbox card">
      <form method="post">

        <?php

        if ($action == 'youtube')
        {
          ?>

          <h3><?php _e('YouTube Settings', 'utvg'); ?></h3>
          <p>
            <label><?php _e('Youtube API Key:', 'utvg'); ?></label>
            <input type="text" name="youtubeApiKey" value="<?php echo $this->_options['youtubeApiKey']; ?>"/>
            <span class="utv-hint"><?php _e('ex: your Youtube API key, needed for using playlist features', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Video Player Controls Theme:', 'utvg'); ?></label>
            <select name="playerControlTheme">

              <?php

              $opts = array(array('text' => __('Dark', 'utvg'), 'value' => 'dark'), array('text' => __('Light', 'utvg'), 'value' => 'light'));

              foreach ($opts as $val)
              {
                if ($val['value'] == $this->_options['playerControlTheme'])
                  echo '<option value="' . $val['value'] . '" selected>' . $val['text'] . '</option>';
                else
                  echo '<option value="' . $val['value'] . '">' . $val['text'] . '</option>';
              }

              ?>

            </select>
            <span class="utv-hint"><?php _e("ex: theme of the player's controls (if shown - YouTube only)", "utvg"); ?></span>
          </p>
          <p>
            <label><?php _e('Video Player Controlbar Color:', 'utvg'); ?></label>
            <select name="playerProgressColor">

              <?php

              $opts = array(array('text' => __('Red', 'utvg'), 'value' => 'red'), array('text' => __('White', 'utvg'), 'value' => 'white'));

              foreach ($opts as $val)
              {
                if($val['value'] == $this->_options['playerProgressColor'])
                  echo '<option value="' . $val['value'] . '" selected>' . $val['text'] . '</option>';
                else
                  echo '<option value="' . $val['value'] . '">' . $val['text'] . '</option>';
              }

              ?>

            </select>
            <span class="utv-hint"><?php _e("ex: color of the player's progress bar (YouTube only)", "utvg"); ?></span>
          </p>
          <p>
            <label><?php _e('Autoplay Videos:', 'utvg'); ?></label>
            <input type="checkbox" name="youtubeAutoplay" <?php echo ($this->_options['youtubeAutoplay'] == '1' ? 'checked' : ''); ?>/>
            <span class="utv-hint"><?php _e('ex: autoplay YouTube videos when clicked', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Hide Video Details:', 'utvg'); ?></label>
            <input type="checkbox" name="youtubeDetailsHide" <?php echo ($this->_options['youtubeDetailsHide'] == '1' ? 'checked' : ''); ?>/>
            <span class="utv-hint"><?php _e('ex: use a minimal player for YouTube videos', 'utvg'); ?></span>
          </p>
          <p class="submit">
            <input type="submit" name="utSaveOptsYouTube" value="<?php _e('Save Changes', 'utvg') ?>" class="button-primary"/>
            <?php wp_nonce_field('utubevideo_update_options_youtube'); ?>
          </p>

          <?php

        }
        elseif ($action == 'vimeo')
        {
          ?>

          <h3><?php _e('Vimeo', 'utvg'); ?></h3>
          <p>
            <label><?php _e('Autoplay Videos:', 'utvg'); ?></label>
            <input type="checkbox" name="vimeoAutoplay" <?php echo ($this->_options['vimeoAutoplay'] == '1' ? 'checked' : ''); ?>/>
            <span class="utv-hint"><?php _e('ex: autoplay Vimeo videos when clicked, may be overridden by uploader', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Hide Video Details:', 'utvg'); ?></label>
            <input type="checkbox" name="vimeoDetailsHide" <?php echo ($this->_options['vimeoDetailsHide'] == '1' ? 'checked' : ''); ?>/>
            <span class="utv-hint"><?php _e('ex: use a minimal player for Vimeo videos, may be overridden by uploader', 'utvg'); ?></span>
          </p>
          <p class="submit">
            <input type="submit" name="utSaveOptsVimeo" value="<?php _e('Save Changes', 'utvg') ?>" class="button-primary"/>
            <?php wp_nonce_field('utubevideo_update_options_vimeo'); ?>
          </p>

          <?php
        }
        elseif($action == 'status')
        {
          ?>

          <h3><?php _e('Status', 'utvg'); ?></h3>
          <p>

            <?php

            global $wp_rewrite;
            $permacheck = '<span class="utv-ok-code">' . __('Ok', 'utvg') . '</span>';

            if(!$wp_rewrite->using_permalinks())
            $permacheck = '<span class="utv-error-code">' . __('Permalinks are not enabled, please enable permalinks for site', 'utvg') . '</span>';
            elseif(!in_array('index.php?pagename=$matches[1]&albumid=$matches[2]', $wp_rewrite->wp_rewrite_rules()))
            $permacheck = '<span class="utv-error-code">' . __('Rewrite rules not set, please disable and re-enable plugin to fix', 'utvg') . '</span>';

            ?>

            <label><?php _e('Permalink Status:', 'utvg'); ?></label>
            <?php echo $permacheck; ?>
            <span class="utv-hint"><?php _e('ex: permalink status check', 'utvg'); ?></span>
          </p>
          <p>

            <?php

            if (extension_loaded('gd'))
              $gdstatus = '<span class="utv-ok-code">' . __('Enabled', 'utvg') . '</span>';
            else
              $gdstatus = '<span class="utv-error-code">' . __('Not Enabled', 'utvg') . '</span>';

            ?>

            <label><?php _e('GD Extension:', 'utvg'); ?></label>
            <?php echo $gdstatus; ?>
            <span class="utv-hint"><?php _e('ex: used for saving thumbnails', 'utvg'); ?></span>
          </p>
          <p>

            <?php

            if (extension_loaded('imagick'))
              $imagickstatus = '<span class="utv-ok-code">' . __('Enabled', 'utvg') . '</span>';
            else
              $imagickstatus = '<span class="utv-error-code">' . __('Disabled', 'utvg') . '</span>';

            ?>

            <label><?php _e('Imagick Extension:', 'utvg'); ?></label>
            <?php echo $imagickstatus; ?>
            <span class="utv-hint"><?php _e('ex: used for saving thumbnails', 'utvg'); ?></span>
          </p>
          <p class="submit">
            <input type="submit" value="<?php _e('Fix Permalinks', 'utvg'); ?>" class="button-secondary" name="resetPermalinks"/>
            <?php wp_nonce_field('utubevideo_update_options_status'); ?>
          </p>

          <?php
        }
        else
        {
          ?>

          <h3><?php _e('General Settings', 'utvg'); ?></h3>
          <p>
            <label><?php _e('Max Video Player Dimensions:', 'utvg'); ?></label>
            <span id="utv-videoplayer-dimensions-option">
              <input type="text" name="playerWidth" id="utv-player-width" class="utv-mini-textbox" value="<?php echo $this->_options['playerWidth']; ?>"/>
              <span> X </span>
              <input type="text" name="playerHeight" id="utv-player-height" class="utv-mini-textbox" value="<?php echo $this->_options['playerHeight']; ?>"/>
            </span>
            <button id="utv-reset-width" class="button-secondary"><?php _e('Reset', 'utvg'); ?></button>
            <span class="utv-hint"><?php _e('ex: max dimensions of video player', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Thumbnail Width:', 'utvg'); ?></label>
            <input type="number" name="thumbnailWidth" id="utv-thumbnail-width" value="<?php echo $this->_options['thumbnailWidth']; ?>"/>
            <button id="utv-reset-thumbnail-width" class="button-secondary"><?php _e('Reset', 'utvg'); ?></button>
            <span class="utv-hint"><?php _e('ex: width of video thumbnails', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Thumbnail Horizontal Padding:', 'utvg'); ?></label>
            <input type="number" name="thumbnailHorizontalPadding" id="utv-thumbnail-horizontal-padding" value="<?php echo $this->_options['thumbnailPadding']; ?>"/>
            <button id="utv-reset-thumbnail-horizontal-padding" class="button-secondary"><?php _e('Reset', 'utvg'); ?></button>
            <span class="utv-hint"><?php _e('ex: padding for video thumbnails', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Thumbnail Vertical Padding:', 'utvg'); ?></label>
            <input type="number" name="thumbnailVerticalPadding" id="utv-thumbnail-vertical-padding" value="<?php echo $this->_options['thumbnailVerticalPadding']; ?>"/>
            <button id="utv-reset-thumbnail-vertical-padding" class="button-secondary"><?php _e('Reset', 'utvg'); ?></button>
            <span class="utv-hint"><?php _e('ex: padding for video thumbnails', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Thumbnail Border Radius:', 'utvg'); ?></label>
            <input type="number" name="thumbnailBorderRadius" id="utv-thumbnail-borderradius" value="<?php echo $this->_options['thumbnailBorderRadius']; ?>"/>
            <button id="utv-reset-thumbnail-borderradius" class="button-secondary"><?php _e('Reset', 'utvg'); ?></button>
            <span class="utv-hint"><?php _e('ex: roundness of thumbnail corners, set to 0 to disable', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Overlay Color:', 'utvg'); ?></label>
            <input type="text" name="fancyboxOverlayColor" id="utv-overlay-color" value="<?php echo $this->_options['fancyboxOverlayColor']; ?>"/>
            <button id="utv-reset-overlay-color" class="button-secondary"><?php _e('Reset', 'utvg'); ?></button>
            <span class="utv-hint"><?php _e('ex: color of lightbox overlay, any hex color', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Overlay Opacity:', 'utvg'); ?></label>
            <input type="text" name="fancyboxOverlayOpacity" id="utv-overlay-opacity" value="<?php echo $this->_options['fancyboxOverlayOpacity']; ?>"/>
            <button id="utv-reset-overlay-opacity" class="button-secondary"><?php _e('Reset', 'utvg'); ?></button>
            <span class="utv-hint"><?php _e('ex: opacity of lightbox overlay [ 0 - 1.0 ]', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Remove Magnific Popup Scripts:', 'utvg'); ?></label>
            <input type="checkbox" name="skipMagnificPopup" <?php echo ($this->_options['skipMagnificPopup'] == 'yes' ? 'checked' : ''); ?>/>
            <span class="utv-hint"><?php _e('ex: check only if you are already loading the Magnific Popup scripts elsewhere', 'utvg'); ?></span>
          </p>
          <p>
            <label><?php _e('Do not use permalinks:', 'utvg'); ?></label>
            <input type="checkbox" name="skipSlugs" <?php echo ($this->_options['skipSlugs'] == 'yes' ? 'checked' : ''); ?>/>
            <span class="utv-hint"><?php _e('ex: check to use "?aid=" for album links instead of permalinks', 'utvg'); ?></span>
          </p>
          <p class="submit">
            <input type="submit" name="utSaveOptsGeneral" value="<?php _e('Save Changes', 'utvg') ?>" class="button-primary"/>
            <?php wp_nonce_field('utubevideo_update_options_general'); ?>
          </p>

          <?php
        }
        ?>

      </form>
    </div>
  </div>
</div>
