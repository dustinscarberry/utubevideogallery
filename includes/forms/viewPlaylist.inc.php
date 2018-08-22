<?php

$ID = sanitize_key($_GET['id']);
$playlist = $wpdb->get_results('SELECT p.*, ALB_NAME FROM ' . $wpdb->prefix . 'utubevideo_playlist p INNER JOIN ' . $wpdb->prefix . 'utubevideo_album a ON p.ALB_ID = a.ALB_ID  WHERE PLAY_ID = ' . $ID, ARRAY_A);

if (!isset($playlist[0]))
{
  _e('Invalid Playlist ID', 'utvg');
  return;
}

$playlist = $playlist[0];

//get internal videos
$internalVideos = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_video WHERE PLAY_ID = ' . $ID, ARRAY_A);

//get external videos
if ($playlist['PLAY_SOURCE'] == 'youtube')
  $externalVideos = utvAdminGen::getYouTubePlaylistData($this->_options['youtubeApiKey'], $playlist['PLAY_SOURCEID']);
else
  $externalVideos = utvAdminGen::getVimeoPlaylistData($playlist['PLAY_SOURCEID']);

//legend 0 = own, 1 = external, 2 = both
$combinedVideos = [];
$thumbCacheDirectory = wp_upload_dir()['baseurl'] . '/utubevideo-cache/';

//filter with internal videos
foreach ($internalVideos as $video)
{
  $needle = $video['VID_URL'];
  $combinedVideos[$needle] = [
    'videoTitle' => htmlspecialchars(stripcslashes($video['VID_NAME']), ENT_QUOTES),
    'thumbURL' => $thumbCacheDirectory . $needle . $video['VID_ID'] . '.jpg',
    'apiThumbURL' => '',
    'localID' => $video['VID_ID'],
    'legend' => 0
  ];
}

//filter with external videos
foreach ($externalVideos['videos'] as $video)
{
  $needle = $video['videoId'];

  if (!array_key_exists($needle, $combinedVideos))
    $combinedVideos[$needle] = [
      'videoTitle' => $video['title'],
      'thumbURL' => $video['thumbURL'],
      'apiThumbURL' => $video['thumbURL'],
      'localID' => '',
      'legend' => 1
    ];
  else
  {
    $combinedVideos[$needle]['legend'] = 2;
    $combinedVideos[$needle]['apiVideoTitle'] = $video['title'];
    $combinedVideos[$needle]['apiThumbURL'] = $video['thumbURL'];
  }
}

$playlistVideosCount = count($combinedVideos);
$selectedVideosCount = count($internalVideos);

?>

<div class="utv-left-column">
  <div class="utv-formbox utv-top-formbox card">
    <form method="post">
      <h3><?php echo __('Edit / Sync playlist ', 'utvg') . ' ' . '<span class="utv-sub-h3">( ' . stripcslashes($playlist['PLAY_TITLE']) . ' )</span>'; ?></h3>
      <p>
        <label><?php _e('Source:', 'utvg'); ?></label>
        <input type="text" value="<?php echo ($playlist['PLAY_SOURCE'] == 'youtube' ? 'YouTube' : 'Vimeo'); ?>" readonly>
        <span class="utv-hint"><?php _e('ex: the source of the playlist', 'utvg'); ?></span>
      </p>
      <p>
        <label><?php _e('Source ID:', 'utvg'); ?></label>
        <input type="text" value="<?php echo $playlist['PLAY_SOURCEID']; ?>" readonly>
        <span class="utv-hint"><?php _e('ex: the source ID of the playlist', 'utvg'); ?></span>
      </p>
      <p>
        <label><?php _e('Album:', 'utvg'); ?></label>
        <input type="text" value="<?php echo $playlist['ALB_NAME']; ?>" readonly>
        <span class="utv-hint"><?php _e('ex: the album containing playlist', 'utvg'); ?></span>
      </p>
      <p>
        <label><?php _e('Quality:', 'utvg'); ?></label>
        <select name="playlistSyncQuality">

          <?php

          $opts = [
            ['text' => '480p', 'value' => 'large'],
            ['text' => '720p', 'value' => 'hd720'],
            ['text' => '1080p', 'value' => 'hd1080']
          ];

          foreach ($opts as $val)
          {
            if ($val['value'] == $playlist['PLAY_QUALITY'])
              echo '<option value="' . $val['value'] . '" selected>' . $val['text'] . '</option>';
            else
              echo '<option value="' . $val['value'] . '">' . $val['text'] . '</option>';
          }

          ?>

        </select>
        <span class="utv-hint"><?php _e('ex: the starting quality of the playlist videos', 'utvg'); ?></span>
      </p>
      <p>
        <label><?php _e('Chromeless:', 'utvg'); ?></label>
        <input type="checkbox" name="playlistSyncChrome"  <?php echo ($playlist['PLAY_CHROME'] == '0' ? 'checked' : ''); ?>>
        <span class="utv-hint"><?php _e('ex: hide the playback controls of the videos', 'utvg'); ?></span>
      </p>
      <p>
        <label><?php _e('Last Updated:', 'utvg'); ?></label>
        <input type="text" value="<?php echo date('Y/m/d g:iA', $playlist['PLAY_UPDATEDATE']); ?>" readonly>
        <span class="utv-hint"><?php _e('ex: last date and time updated', 'utvg'); ?></span>
      </p>
      <p>
        <label><?php _e('Sync Method:', 'utvg'); ?></label>
        <select name="playlistSyncMethod">
          <option value="syncSelected" selected>Sync Selected</option>
          <option value="syncNew">Sync New</option>
          <option value="syncAll">Sync All</option>
        </select>
        <span class="utv-hint"><?php _e('ex: choose how playlist is synced', 'utvg'); ?></span>
      </p>
      <p class="submit">
        <input type="hidden" name="playlistID" value="<?php echo $ID; ?>">
        <input type="hidden" name="playlistSyncData" id="utv-playlist-sync-data">
        <input type="submit" name="syncPlaylist" id="utv-playlist-sync-save" value="<?php _e('Sync / Save Changes', 'utvg') ?>" class="button-primary">
        <?php wp_nonce_field('utubevideo_editsync_playlist'); ?>
        <a href="?page=utubevideo_playlists" class="utv-cancel"><?php _e('Go Back', 'utvg'); ?></a>
      </p>
      <p>
        <span id="utv-sync-playlist-message" class="utv-js-errors"></span>
      </p>
    </form>
  </div>
</div>
<div class="utv-right-column">
  <div class="utv-formbox utv-top-formbox card">
    <h3>
      <?php echo __('Playlist Items:', 'utvg'); ?>
      <span class="utv-playlist-preview-count">( <span id="utv-playlist-preview-selectedcount"><?php echo $selectedVideosCount; ?></span> / <span id="utv-playlist-preview-totalcount"><?php echo $playlistVideosCount; ?></span> selected )</span>
      <span id="utv-playlist-sync-selectall">All</span>
      <span id="utv-playlist-sync-selectnone">None</span>
    </h3>
    <div id="utv-playlist-sync-legendref">
      <div>
        <label>Local:</label>
        <span class="utv-playlist-local"></span>
      </div>
      <div>
        <label>Web:</label>
        <span class="utv-playlist-web"></span>
      </div>
      <div>
        <label>Both:</label>
        <span class="utv-playlist-both"></span>
      </div>
    </div>
    <div id="utv-playlist-preview">

      <?php

      $i = 1;

      foreach ($combinedVideos as $key => $video)
      {
        if ($video['legend'] == 0)
        {
          $legendClass = 'utv-playlist-local';
          $choiceClass = 'utv-playlist-choice-active';
        }
        elseif ($video['legend'] == 1)
        {
          $legendClass = 'utv-playlist-web';
          $choiceClass = '';
        }
        elseif ($video['legend'] == 2)
        {
          $legendClass = 'utv-playlist-both';
          $choiceClass = 'utv-playlist-choice-active';
        }

        echo '<div class="utv-playlist-preview-item">
        <span class="utv-playlist-preview-item-num">' . $i . ')</span>
        <div class="utv-playlist-choice ' . $choiceClass . '">
        <img src="' . $video['thumbURL'] . '">
        <span class="utv-playlist-choice-overlay"></span>
        </div>
        <div class="utv-playlist-preview-form">
        <input type="text" class="utv-playlist-item-title" value="' . $video['videoTitle'] . '">
        <span class="' . $legendClass . '"></span>
        <input type="hidden" class="utv-playlist-item-id" value="' . $video['localID'] . '">
        <input type="hidden" class="utv-playlist-item-sourceid" value="' . $key . '">
        <input type="hidden" class="utv-playlist-item-apithumburl" value="' . $video['apiThumbURL'] . '">
        </div>
        </div>';

        $i++;
      }

      ?>

    </div>
  </div>
</div>
