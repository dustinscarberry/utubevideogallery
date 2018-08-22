<?php

if (!empty($_POST))
{
  //declare globals
  global $wpdb;

  //require helper classes
  require_once(dirname(__FILE__) . '/../class/utvAdminGen.class.php');
  utvAdminGen::initialize($this->_options);

  //save general options script//
  if (isset($_POST['utSaveOptsGeneral']))
  {
    if (check_admin_referer('utubevideo_update_options_general'))
    {
      //load options into array
      $opts = $this->_options;

      //update options based on user input
      $opts['skipMagnificPopup'] = (isset($_POST['skipMagnificPopup']) ? 'yes' : 'no');
      $opts['skipSlugs'] = (isset($_POST['skipSlugs']) ? 'yes' : 'no');
      $opts['fancyboxOverlayColor'] = (isset($_POST['fancyboxOverlayColor']) ? sanitize_text_field($_POST['fancyboxOverlayColor']) : '#000');
      $opts['fancyboxOverlayOpacity'] = (isset($_POST['fancyboxOverlayOpacity']) ? sanitize_text_field($_POST['fancyboxOverlayOpacity']) : '0.85');
      $opts['thumbnailWidth'] = (isset($_POST['thumbnailWidth']) ? sanitize_text_field($_POST['thumbnailWidth']) : '150');
      $opts['thumbnailPadding'] = (isset($_POST['thumbnailHorizontalPadding']) ? sanitize_text_field($_POST['thumbnailHorizontalPadding']) : '10');
      $opts['thumbnailVerticalPadding'] = (isset($_POST['thumbnailVerticalPadding']) ? sanitize_text_field($_POST['thumbnailVerticalPadding']) : '10');
      $opts['thumbnailBorderRadius'] = (isset($_POST['thumbnailBorderRadius']) ? sanitize_text_field($_POST['thumbnailBorderRadius']) : '3');

      if (!empty($_POST['playerWidth']) && !empty($_POST['playerHeight']))
      {
        $opts['playerWidth'] = sanitize_text_field($_POST['playerWidth']);
        $opts['playerHeight'] = sanitize_text_field($_POST['playerHeight']);
      }
      else
      {
        $opts['playerWidth'] = 950;
        $opts['playerHeight'] = 537;
      }

      if (preg_match("/[^0-9]/", $opts['thumbnailWidth']) || preg_match("/[^0-9]/", $opts['thumbnailPadding']) || preg_match("/[^0-9]/", $opts['thumbnailVerticalPadding']) || preg_match("/[^0-9]/", $opts['thumbnailBorderRadius']))
      {
        utvAdminGen::printMessage(__('Error: thumbnail width, padding, and radius must contain only numbers.'), 'error');
        return;
      }

      if ($opts['thumbnailWidth'] != $this->_options['thumbnailWidth'])
      {
        //override admin helper object with new options
        utvAdminGen::initialize($opts);

        $videoData = $wpdb->get_results('SELECT VID_ID, VID_URL, VID_SOURCE, VID_THUMBTYPE, DATA_THUMBTYPE FROM ' . $wpdb->prefix . 'utubevideo_video v JOIN ' . $wpdb->prefix . 'utubevideo_album a ON (v.ALB_ID = a.ALB_ID) JOIN ' . $wpdb->prefix . 'utubevideo_dataset d ON (a.DATA_ID = d.DATA_ID)', ARRAY_A);

        foreach ($videoData as $video)
        {
          if ($video['VID_SOURCE'] == 'vimeo')
          {
            $data = utvAdminGen::queryAPI('https://vimeo.com/api/v2/video/' . $video['VID_URL'] . '.json')[0];
            $sourceURL = $data['thumbnail_large'];
          }
          else
            $sourceURL = 'http://img.youtube.com/vi/' . $video['VID_URL'] . '/0.jpg';

          //resave thumbnail
          utvAdminGen::saveThumbnail($sourceURL, $video['VID_URL'] . $video['VID_ID'], $video['DATA_THUMBTYPE'], true);

          //update thumbnail type in database if needed - compatibilty
          if ($video['VID_THUMBTYPE'] != $video['DATA_THUMBTYPE'])
          {
            $wpdb->update(
              $wpdb->prefix . 'utubevideo_video',
              [
                'VID_THUMBTYPE' => $video['DATA_THUMBTYPE']
              ],
              ['VID_ID' => $video['VID_ID']]
            );
          }
        }
      }

      if (update_option('utubevideo_main_opts', $opts))
        utvAdminGen::printMessage(__('Settings saved', 'utvg'), 'success', true, true);
      else
        utvAdminGen::printMessage(__('No setting updates needed', 'utvg'), 'warning');
    }
  }
  //save youtube options script
  elseif (isset($_POST['utSaveOptsYouTube']))
  {
    if (check_admin_referer('utubevideo_update_options_youtube'))
    {
      //load options into array
      $opts = $this->_options;

      //update options based on user input
      $opts['youtubeApiKey'] = (isset($_POST['youtubeApiKey']) ? sanitize_text_field($_POST['youtubeApiKey']) : '');
      $opts['youtubeAutoplay'] = (isset($_POST['youtubeAutoplay']) ? 1 : 0);
      $opts['youtubeDetailsHide'] = (isset($_POST['youtubeDetailsHide']) ? 1 : 0);
      $opts['playerControlTheme'] = sanitize_text_field($_POST['playerControlTheme']);
      $opts['playerProgressColor'] = sanitize_text_field($_POST['playerProgressColor']);

      if (update_option('utubevideo_main_opts', $opts))
        utvAdminGen::printMessage(__('Settings saved', 'utvg'), 'success', true, true);
      else
        utvAdminGen::printMessage(__('No setting updates needed', 'utvg'), 'warning');
    }
  }
  //save vimeo options script
  elseif (isset($_POST['utSaveOptsVimeo']))
  {
    if (check_admin_referer('utubevideo_update_options_vimeo'))
    {
      //load options into array
      $opts = $this->_options;

      //update options based on user input
      $opts['vimeoAutoplay'] = (isset($_POST['vimeoAutoplay']) ? 1 : 0);
      $opts['vimeoDetailsHide'] = (isset($_POST['vimeoDetailsHide']) ? 1 : 0);

      if (update_option('utubevideo_main_opts', $opts))
        utvAdminGen::printMessage(__('Settings saved', 'utvg'), 'success', true, true);
      else
        utvAdminGen::printMessage(__('No setting updates needed', 'utvg'), 'warning');
    }
  }
  //fix permalinks script
  elseif (isset($_POST['resetPermalinks']))
  {
    if (check_admin_referer('utubevideo_update_options_status'))
    {
      //setup rewrite rule for video albums
      add_rewrite_rule('([^/]+)/album/([^/]+)$', 'index.php?pagename=$matches[1]&albumid=$matches[2]', 'top');

      global $wp_rewrite;
      $wp_rewrite->flush_rules(false);

      utvAdminGen::printMessage(__('Permalinks updated', 'utvg'), 'success', true, true);
    }
  }
  //save new gallery script//
  elseif (isset($_POST['createGallery']))
  {
    if (check_admin_referer('utubevideo_save_gallery'))
    {
      $shortname = sanitize_text_field($_POST['galleryName']);
      $albumsort = sanitize_text_field($_POST['albumSort']);
      $thumbType = sanitize_text_field($_POST['thumbType']);
      $displaytype = sanitize_text_field($_POST['displayType']);
      $time = current_time('timestamp');

      if (empty($shortname) || empty($albumsort) || empty($displaytype) || empty($thumbType))
      {
        utvAdminGen::printMessage(__('Error: All form fields must have a value', 'utvg'), 'error');
        return;
      }

      if ($wpdb->insert(
        $wpdb->prefix . 'utubevideo_dataset',
        [
          'DATA_NAME' => $shortname,
          'DATA_SORT' => $albumsort,
          'DATA_THUMBTYPE' => $thumbType,
          'DATA_DISPLAYTYPE' => $displaytype,
          'DATA_UPDATEDATE' => $time
        ]
      ))
        utvAdminGen::printMessage(__('Gallery created', 'utvg'), 'success', true, true);
      else
        utvAdminGen::printMessage(__('Error: Something went wrong', 'utvg'), 'error');
    }
  }
  //save a gallery edit script//
  elseif (isset($_POST['saveGalleryEdit']))
  {
    if (check_admin_referer('utubevideo_edit_gallery'))
    {
      $galleryID = sanitize_key($_POST['key']);
      $galleryName = sanitize_text_field($_POST['galname']);
      $albumSort = sanitize_text_field($_POST['albumSort']);
      $thumbType = sanitize_text_field($_POST['thumbType']);
      $displayType = sanitize_text_field($_POST['displayType']);
      $time = current_time('timestamp');

      if (empty($galleryName) || !isset($galleryID) || empty($albumSort) || empty($displayType) || empty($thumbType))
      {
        utvAdminGen::printMessage(__('Error: All form fields must have a value', 'utvg'), 'error');
        return;
      }

      if ($wpdb->update(
        $wpdb->prefix . 'utubevideo_dataset',
        [
          'DATA_NAME' => $galleryName,
          'DATA_SORT' => $albumSort,
          'DATA_THUMBTYPE' => $thumbType,
          'DATA_DISPLAYTYPE' => $displayType,
          'DATA_UPDATEDATE' => $time
        ],
        ['DATA_ID' => $galleryID]
      ) >= 0)
        utvAdminGen::printMessage(__('Gallery updated', 'utvg'), 'success', true, true);
      else
        utvAdminGen::printMessage(__('Error: Something went wrong', 'utvg'), 'error');
    }
  }
  //save a new album script//
  elseif (isset($_POST['saveAlbum']))
  {
    if (check_admin_referer('utubevideo_save_album'))
    {
      $galleryID = sanitize_key($_POST['key']);
      $albumName = sanitize_text_field($_POST['alname']);
      $videoSort = ($_POST['vidSort'] == 'desc' ? 'desc' : 'asc');
      $time = current_time('timestamp');

      if (empty($albumName) || empty($videoSort) || !isset($galleryID))
      {
        utvAdminGen::printMessage(__('Error: All form fields must have a value', 'utvg'), 'error');
        return;
      }

      $slug = utvAdminGen::generateSlug($albumName, $wpdb);

      //get current album count for gallery//
      $albumCount = $wpdb->get_results('SELECT COUNT(ALB_ID) AS ALB_COUNT FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $galleryID, ARRAY_A)[0];
      $nextSortPos = $albumCount['ALB_COUNT'];

      if ($wpdb->insert(
        $wpdb->prefix . 'utubevideo_album',
        [
          'ALB_NAME' => $albumName,
          'ALB_SLUG' => $slug,
          'ALB_THUMB' => 'missing',
          'ALB_SORT' => $videoSort,
          'ALB_UPDATEDATE' => $time,
          'ALB_POS' => $nextSortPos,
          'DATA_ID' => $galleryID
        ]
      ))
        utvAdminGen::printMessage(__('Video album created', 'utvg'), 'success', true, true);
      else
        utvAdminGen::printMessage(__('Error: Something went wrong', 'utvg'), 'error');
    }
  }
  //save a new video script//
  elseif (isset($_POST['addVideo']))
  {
    if (check_admin_referer('utubevideo_add_video'))
    {
      $url = sanitize_text_field($_POST['url']);
      $videoName = sanitize_text_field($_POST['vidname']);
      $quality = sanitize_text_field($_POST['videoQuality']);
      $chrome = (isset($_POST['videoChrome']) ? 0 : 1);
      $videoSource = sanitize_text_field($_POST['videoSource']);
      $startTime = sanitize_text_field($_POST['startTime']);
      $endTime = sanitize_text_field($_POST['endTime']);
      $albumID = sanitize_key($_POST['key']);
      $time = current_time('timestamp');

      if (empty($url) || empty($quality) || !isset($chrome) || empty($videoSource) || !isset($albumID))
      {
        utvAdminGen::printMessage(__('Error: All form fields must have a value', 'utvg'), 'error');
        return;
      }

      //get current video count for album//
      $videoCount = $wpdb->get_results('SELECT COUNT(VID_ID) AS VID_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $albumID, ARRAY_A)[0];
      $gallery = $wpdb->get_results('SELECT DATA_THUMBTYPE FROM ' . $wpdb->prefix . 'utubevideo_album a INNER JOIN ' . $wpdb->prefix . 'utubevideo_dataset d ON a.DATA_ID = d.DATA_ID WHERE a.ALB_ID = ' . $albumID, ARRAY_A)[0];

      $nextSortPos = $videoCount['VID_COUNT'];

      if (!$vID = utvAdminGen::parseURL($url, $videoSource, 'video'))
      {
        utvAdminGen::printMessage(__('Invalid URL.', 'utvg'), 'error');
        return;
      }

      if ($videoSource == 'youtube')
        $sourceURL = 'http://img.youtube.com/vi/' . $vID . '/0.jpg';
      elseif ($videoSource == 'vimeo')
      {
        $data = utvAdminGen::queryAPI('https://vimeo.com/api/v2/video/' . $vID . '.json');
        $sourceURL = $data[0]['thumbnail_large'];
      }

      //insert new video
      if ($wpdb->insert(
        $wpdb->prefix . 'utubevideo_video',
        [
          'VID_SOURCE' => $videoSource,
          'VID_NAME' => $videoName,
          'VID_URL' => $vID,
          'VID_THUMBTYPE' => $gallery['DATA_THUMBTYPE'],
          'VID_QUALITY' => $quality,
          'VID_CHROME' => $chrome,
          'VID_STARTTIME' => $startTime,
          'VID_ENDTIME' => $endTime,
          'VID_POS' => $nextSortPos,
          'VID_UPDATEDATE' => $time,
          'ALB_ID' => $albumID
        ]
      ))
      {
        //get last insert id and save thumbnail
        $idnum = $wpdb->insert_id;

        if (!utvAdminGen::saveThumbnail($sourceURL, $vID . $idnum, $gallery['DATA_THUMBTYPE']))
        {
          $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_video WHERE VID_ID ="' . $idnum . '"');
          utvAdminGen::printMessage(__('Error: Video thumbnail failed to save correctly.', 'utvg'), 'error');
          return;
        }

        utvAdminGen::printMessage(__('Video added to album.', 'utvg'), 'success', true, true);
      }
      else
        utvAdminGen::printMessage(__('Error: Something went wrong. Please try again.', 'utvg'), 'error');
    }
  }
  //save a playlist script//
  elseif (isset($_POST['addPlaylist']))
  {
    if (check_admin_referer('utubevideo_add_playlist'))
    {
      //get variables
      $albumID = sanitize_key($_POST['albumID']);
      $playlistTitle = sanitize_text_field($_POST['playlistTitle']);
      $playlistSource = sanitize_text_field($_POST['playlistSource']);
      $playlistSourceId = utvAdminGen::parseURL(sanitize_text_field($_POST['url']), $playlistSource, 'playlist');
      $quality = sanitize_text_field($_POST['videoQuality']);
      $chrome = isset($_POST['videoChrome']) ? 0 : 1;
      $playlistData = json_decode(stripslashes($_POST['playlistAddData']), true);
      $time = current_time('timestamp');

      //check for empty fields
      if (empty($playlistTitle) || empty($playlistSourceId) || empty($quality) || empty($playlistSource) || !isset($albumID))
      {
        utvAdminGen::printMessage(__('All form fields must have a value', 'utvg'), 'error');
        return;
      }

      //get current video count for album//
      $videoCount = $wpdb->get_results('SELECT COUNT(VID_ID) AS VID_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $albumID, ARRAY_A)[0];
      $gallery = $wpdb->get_results('SELECT DATA_THUMBTYPE FROM ' . $wpdb->prefix . 'utubevideo_album a INNER JOIN ' . $wpdb->prefix . 'utubevideo_dataset d ON a.DATA_ID = d.DATA_ID WHERE a.ALB_ID = ' . $albumID, ARRAY_A)[0];

      //set sort position
      $nextSortPos = $videoCount['VID_COUNT'];

      //insert playlist into database
      if (!$wpdb->insert(
        $wpdb->prefix . 'utubevideo_playlist',
        [
          'PLAY_TITLE' => $playlistTitle,
          'PLAY_SOURCE' => $playlistSource,
          'PLAY_SOURCEID' => $playlistSourceId,
          'PLAY_QUALITY' => $quality,
          'PLAY_CHROME' => $chrome,
          'PLAY_UPDATEDATE' => $time,
          'ALB_ID' => $albumID
        ]
      ))
      {
        utvAdminGen::printMessage(__('An internal error has occurred.', 'utvg'), 'error');
        return;
      }

      //get id of inserted playlist
      $playlistID = $wpdb->insert_id;

      //process playlist video data
      foreach ($playlistData as $video)
      {
        if (!utvAdminGen::insertNewPlaylistVideo($video['title'], $playlistSource, $video['sourceID'], $gallery['DATA_THUMBTYPE'], $video['thumbURL'], $quality, $chrome, $nextSortPos, $albumID, $playlistID, $wpdb))
        {
          utvAdminGen::printMessage(__('Error adding a video in the playlist', 'utvg'), 'error');
          return;
        }

        $nextSortPos++;
      }

      utvAdminGen::printMessage(__('Playlist added to album', 'utvg'), 'success', true, true);
    }
  }
  //sync a playlist script//
  elseif (isset($_POST['syncPlaylist']))
  {
    //check referer
    if (check_admin_referer('utubevideo_editsync_playlist'))
    {
      //get variables
      $playlistID = sanitize_key($_POST['playlistID']);
      $playlistQuality = sanitize_text_field($_POST['playlistSyncQuality']);
      $playlistChrome = isset($_POST['playlistSyncChrome']) ? 0 : 1;
      $playlistSyncMethod = sanitize_text_field($_POST['playlistSyncMethod']);
      $playlistData = json_decode(stripslashes($_POST['playlistSyncData']), true);
      $time = current_time('timestamp');

      //check for empty fields
      if (empty($playlistQuality) || empty($playlistSyncMethod) || empty($playlistData) || !isset($playlistID))
      {
        utvAdminGen::printMessage(__('All form fields must have a value', 'utvg'), 'error');
        return;
      }

      //get playlist data for processing
      $playlist = $wpdb->get_results('SELECT PLAY_SOURCE, ALB_ID FROM ' . $wpdb->prefix . 'utubevideo_playlist WHERE PLAY_ID =' . $playlistID, ARRAY_A)[0];
      $videoCount = $wpdb->get_results('SELECT COUNT(VID_ID) AS VID_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $playlist['ALB_ID'], ARRAY_A)[0];
      $gallery = $wpdb->get_results('SELECT DATA_THUMBTYPE FROM ' . $wpdb->prefix . 'utubevideo_album a INNER JOIN ' . $wpdb->prefix . 'utubevideo_dataset d ON a.DATA_ID = d.DATA_ID WHERE a.ALB_ID = ' . $playlist['ALB_ID'], ARRAY_A)[0];

      //set sort position
      $nextSortPos = $videoCount['VID_COUNT'];

      //update playlist record
      if ($wpdb->update(
        $wpdb->prefix . 'utubevideo_playlist',
        [
          'PLAY_QUALITY' => $playlistQuality,
          'PLAY_CHROME' => $playlistChrome,
          'PLAY_UPDATEDATE' => $time,
        ],
        ['PLAY_ID' => $playlistID]
      ) < 0)
      {
        utvAdminGen::printMessage(__('Error saving playlist changes', 'utvg'), 'error');
        return;
      }

      if ($playlistSyncMethod == 'syncSelected')
      {
        //process playlist video data
        foreach ($playlistData as $video)
        {
          //delete local video as it is unselected
          if (!$video['selected'] && $video['localID'] != '')
            utvAdminGen::deleteVideos([$video['localID']], $wpdb);
          //if selected
          elseif ($video['selected'])
          {
            //update local video data
            if ($video['localID'] != '')
            {
              if (!utvAdminGen::updateLocalPlaylistVideo($video['title'], $playlistQuality, $playlistChrome, $video['localID'], $wpdb))
              {
                utvAdminGen::printMessage(__('Error updating a video in the playlist', 'utvg'), 'error');
                return;
              }
            }
            //add new video from playlist
            else
            {
              if (!utvAdminGen::insertNewPlaylistVideo($video['title'], $playlist['PLAY_SOURCE'], $video['sourceID'], $gallery['DATA_THUMBTYPE'], $video['thumbURL'], $playlistQuality, $playlistChrome, $nextSortPos, $playlist['ALB_ID'], $playlistID, $wpdb))
              {
                utvAdminGen::printMessage(__('Error adding a video in the playlist', 'utvg'), 'error');
                return;
              }

              $nextSortPos++;
            }
          }
        }
      }
      elseif ($playlistSyncMethod == 'syncNew')
      {
        //process playlist video data
        foreach ($playlistData as $video)
        {
          //add new video from playlist
          if ($video['legend'] == '1')
          {
            if (!utvAdminGen::insertNewPlaylistVideo($video['title'], $playlist['PLAY_SOURCE'], $video['sourceID'], $gallery['DATA_THUMBTYPE'], $video['thumbURL'], $playlistQuality, $playlistChrome, $nextSortPos, $playlist['ALB_ID'], $playlistID, $wpdb))
            {
              utvAdminGen::printMessage(__('Error adding a video in the playlist', 'utvg'), 'error');
              return;
            }

            $nextSortPos++;
          }
        }
      }
      elseif ($playlistSyncMethod == 'syncAll')
      {
        //process playlist video data
        foreach ($playlistData as $video)
        {
          //update local video data
          if ($video['legend'] == '0' || $video['legend'] == '2')
          {
            if (!utvAdminGen::updateLocalPlaylistVideo($video['title'], $playlistQuality, $playlistChrome, $video['localID'], $wpdb))
            {
              utvAdminGen::printMessage(__('Error updating a video in the playlist', 'utvg'), 'error');
              return;
            }
          }
          //add new video from playlist
          elseif ($video['legend'] == '1')
          {
            if (!utvAdminGen::insertNewPlaylistVideo($video['title'], $playlist['PLAY_SOURCE'], $video['sourceID'], $gallery['DATA_THUMBTYPE'], $video['thumbURL'], $playlistQuality, $playlistChrome, $nextSortPos, $playlist['ALB_ID'], $playlistID, $wpdb))
            {
              utvAdminGen::printMessage(__('Error adding a video in the playlist', 'utvg'), 'error');
              return;
            }

            $nextSortPos++;
          }
        }
      }

      utvAdminGen::printMessage(__('Playlist synced successfully', 'utvg'), 'success', true, true);
    }
  }
  //save an album edit script//
  elseif (isset($_POST['saveAlbumEdit']))
  {
    if (check_admin_referer('utubevideo_edit_album'))
    {
      $albumName = sanitize_text_field($_POST['alname']);
      $albumGallery = sanitize_key($_POST['albumGallery']);
      $videoSort = ($_POST['vidSort'] == 'desc' ? 'desc' : 'asc');
      $thumb = (isset($_POST['albumThumbSelect']) ? $_POST['albumThumbSelect'] : 'missing');
      $prevSlug = sanitize_text_field($_POST['prevSlug']);
      $slug = sanitize_text_field($_POST['slug']);
      $albumID = sanitize_key($_POST['key']);
      $time = current_time('timestamp');

      if (empty($albumGallery) || empty($albumName) || empty($videoSort) || empty($thumb) || empty($prevSlug) || empty($slug) || !isset($albumID))
      {
        utvAdminGen::printMessage(__('Error: All form fields must have a value', 'utvg'), 'error');
        return;
      }

      if ($slug != $prevSlug)
        $slug = utvAdminGen::generateSlug($albumName, $wpdb);

      if ($wpdb->update(
        $wpdb->prefix . 'utubevideo_album',
        [
          'ALB_NAME' => $albumName,
          'ALB_SLUG' => $slug,
          'ALB_THUMB' => $thumb,
          'ALB_SORT' => $videoSort,
          'ALB_UPDATEDATE' => $time,
          'DATA_ID' => $albumGallery
        ],
        ['ALB_ID' => $albumID]
      ) >= 0)
        utvAdminGen::printMessage(__('Video album updated', 'utvg'), 'success', true, true);
      else
        utvAdminGen::printMessage(__('Error: Something went wrong', 'utvg'), 'error');
    }
  }
  //save a video edit script//
  elseif (isset($_POST['saveVideoEdit']))
  {
    if (check_admin_referer('utubevideo_edit_video'))
    {
      $videoName = sanitize_text_field($_POST['vidname']);
      $videoAlbum = sanitize_key($_POST['videoAlbum']);
      $quality = sanitize_text_field($_POST['videoQuality']);
      $chrome = isset($_POST['videoChrome']) ? 0 : 1;
      $startTime = sanitize_text_field($_POST['startTime']);
      $endTime = sanitize_text_field($_POST['endTime']);
      $thumbnailRefresh = isset($_POST['thumbnailRefresh']) ? true : false;
      $time = current_time('timestamp');
      $videoID = sanitize_key($_POST['key']);

      if (empty($videoAlbum) || empty($quality) || !isset($chrome) || !isset($videoID))
      {
        utvAdminGen::printMessage(__('Error: All required fields must have a value', 'utvg'), 'error');
        return;
      }

      $video = $wpdb->get_results('SELECT VID_ID, VID_SOURCE, VID_URL, VID_THUMBTYPE, ALB_ID FROM ' . $wpdb->prefix . 'utubevideo_video WHERE VID_ID = ' . $videoID, ARRAY_A)[0];
      $album = $wpdb->get_results('SELECT DATA_ID FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_ID = ' . $video['ALB_ID'], ARRAY_A)[0];
      $gallery = $wpdb->get_results('SELECT DATA_THUMBTYPE FROM ' . $wpdb->prefix . 'utubevideo_dataset WHERE DATA_ID = ' . $album['DATA_ID'], ARRAY_A)[0];

      //resave thumbnail if difference detected or forced
      if ($gallery['DATA_THUMBTYPE'] != $video['VID_THUMBTYPE'] || $thumbnailRefresh)
      {
        if ($video['VID_SOURCE'] == 'youtube')
          $sourceURL = 'http://img.youtube.com/vi/' . $video['VID_URL'] . '/0.jpg';
        elseif($video['VID_SOURCE'] == 'vimeo')
        {
          $data = utvAdminGen::queryAPI('https://vimeo.com/api/v2/video/' . $video['VID_URL'] . '.json')[0];
          $sourceURL = $data['thumbnail_large'];
        }

        if (!utvAdminGen::saveThumbnail($sourceURL, $video['VID_URL'] . $video['VID_ID'], $gallery['DATA_THUMBTYPE']))
          return;
      }

      //update database entry
      if ($wpdb->update(
        $wpdb->prefix . 'utubevideo_video',
        [
          'VID_NAME' => $videoName,
          'VID_THUMBTYPE' => $gallery['DATA_THUMBTYPE'],
          'VID_QUALITY' => $quality,
          'VID_CHROME' => $chrome,
          'VID_STARTTIME' => $startTime,
          'VID_ENDTIME' => $endTime,
          'VID_UPDATEDATE' => $time,
          'ALB_ID' => $videoAlbum
        ],
        ['VID_ID' => $videoID]
      ) >= 0)
        utvAdminGen::printMessage(__('Video updated', 'utvg'), 'success', true, true);
      else
        utvAdminGen::printMessage(__('Error: Something went wrong', 'utvg'), 'error');
    }
  }
}

?>
