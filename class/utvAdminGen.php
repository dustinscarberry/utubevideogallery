<?php

if (!class_exists('utvAdminGen'))
{
  class utvAdminGen
  {
    private static $_options, $_basePath;

    public static function initialize($options)
    {
      self::$_options = $options;
      self::$_basePath = wp_upload_dir();
      self::$_basePath = self::$_basePath['basedir'] . '/utubevideo-cache/';
    }

    public static function saveThumbnail($sourceURL, $destFilename, $thumbType, $suppressErrors = false)
    {
      $image = wp_get_image_editor($sourceURL);

      //valid video thumbnail image
      if (!is_wp_error($image))
      {
        if ($thumbType == 'square')
        {
          $image->resize(self::$_options['thumbnailWidth'] * 2, self::$_options['thumbnailWidth'] * 2, true);
          $image->set_quality(65);
          $image->save(self::$_basePath . $destFilename . '@2x.jpg');

          $image->resize(self::$_options['thumbnailWidth'], self::$_options['thumbnailWidth'], true);
          $image->set_quality(95);
          $image->save(self::$_basePath . $destFilename . '.jpg');
        }
        else
        {
          $image->resize(self::$_options['thumbnailWidth'] * 2, self::$_options['thumbnailWidth'] * 2);
          $image->set_quality(65);
          $image->save(self::$_basePath . $destFilename . '@2x.jpg');

          $image->resize(self::$_options['thumbnailWidth'], self::$_options['thumbnailWidth']);
          $image->set_quality(95);
          $image->save(self::$_basePath . $destFilename . '.jpg');
        }

        return true;
      }
      //invalid video thumbnail image or blank
      elseif (is_wp_error($image))
      {
        //reload missing image into editor
        $image = wp_get_image_editor(plugins_url('missing.jpg', dirname(__FILE__)));

        if (!is_wp_error($image))
        {
          if ($thumbType == 'square')
          {
            $image->resize(self::$_options['thumbnailWidth'] * 2, self::$_options['thumbnailWidth'] * 2, true);
            $image->set_quality(65);
            $image->save(self::$_basePath . $destFilename . '@2x.jpg');

            $image->resize(self::$_options['thumbnailWidth'], self::$_options['thumbnailWidth'], true);
            $image->set_quality(95);
            $image->save(self::$_basePath . $destFilename . '.jpg');
          }
          else
          {
            $image->resize(self::$_options['thumbnailWidth'] * 2, self::$_options['thumbnailWidth'] * 2);
            $image->set_quality(65);
            $image->save(self::$_basePath . $destFilename . '@2x.jpg');

            $image->resize(self::$_options['thumbnailWidth'], self::$_options['thumbnailWidth']);
            $image->set_quality(95);
            $image->save(self::$_basePath . $destFilename . '.jpg');
          }

          return true;
        }
        else
        {
          if (!$suppressErrors)
          {
            self::printMessage(__('Error: There seems to be a problem saving the video(s) thumbnail. Most likely you need to install a PHP image processing library, such as GD or Imagick. Please send the following information to the developer if the problem persists.', 'utvg') . '<pre>' . print_r($image, true) . '</pre>', 'error');
            return false;
          }
          else
            return true;
        }
      }
      else
      {
        if (!$suppressErrors)
        {
          self::printMessage(__('Error: There seems to be a problem saving the video(s) thumbnail. Most likely you need to install a PHP image processing library, such as GD or Imagick. Please send the following information to the developer if the problem persists.', 'utvg') . '<pre>' . print_r($image, true) . '</pre>', 'error');
          return false;
        }
        else
          return true;
      }
    }

    public static function queryAPI($query)
    {
      $data = wp_remote_get($query);
      return json_decode($data['body'], true);
    }

    public static function parseURL($url, $domain, $type)
    {
      $id = false;

      if ($domain == 'youtube')
      {
        if ($type == 'video')
        {
          if (preg_match('/youtu.be\/([0-9A-Za-z_-]{11})/', $url, $matches))
            $id = $matches[1];
          else
          {
            $url = parse_url($url);

            if (isset($url['query']))
            {
              parse_str($url['query'], $querystr);

              if (isset($querystr['v']))
                $id = $querystr['v'];
            }
          }
        }
        elseif ($type == 'playlist')
        {
          $url = parse_url($url);

          if (isset($url['query']))
          {
            parse_str($url['query'], $querystr);

            if (isset($querystr['list']))
              $id = $querystr['list'];
          }
        }
      }
      elseif ($domain == 'vimeo')
      {
        if ($type == 'video')
        {
          if (preg_match('/vimeo.com\/([0-9]+)/', $url, $matches))
            $id = $matches[1];
        }
        elseif ($type == 'playlist')
        {
          if (preg_match('/\/album\/([0-9]+)/', $url, $matches))
            $id = $matches[1];
        }
      }

      return $id;
    }

    public static function deleteVideos($videos, &$wpdb)
    {
      //sanitize key array
      $queryString = implode(', ', array_map('intval', $videos));

      //query database for ids and video url sets
      $videos = $wpdb->get_results('SELECT VID_ID, VID_URL, ALB_ID FROM ' . $wpdb->prefix . 'utubevideo_video WHERE VID_ID IN (' . $queryString . ')', ARRAY_A);
      $deleteCount = count($videos);

      //query database for total count of videos in album
      $totalCount = $wpdb->get_results('SELECT VID_ID FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $videos[0]['ALB_ID'], ARRAY_A);
      $totalCount = count($totalCount);

      //change album thumb to missing if empty
      if (($totalCount - $deleteCount) < 1)
      {
        if ($wpdb->update(
          $wpdb->prefix . 'utubevideo_album',
          ['ALB_THUMB' => 'missing'],
          ['ALB_ID' => $videos[0]['ALB_ID']]
        ) === false)
          return false;
      }

      //delete video data and update album count
      if ($wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_video WHERE VID_ID IN (' . $queryString . ')'
      ) === false)
        return false;

      //delete video thumbnails
      foreach ($videos as $video)
        unlink(self::$_basePath . $video['VID_URL'] . $video['VID_ID'] . '.jpg');

      return true;
    }

    public static function deleteAlbums($albums, &$wpdb)
    {
      //sanitize key array
      $queryString = implode(', ', array_map('intval', $albums));

      //get videos in album to delete//
      $videos = $wpdb->get_results('SELECT VID_ID, VID_URL FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID IN (' . $queryString . ')', ARRAY_A);

      //delete video data and update album count
      if ($wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID IN (' . $queryString . ')'
      ) === false || $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_ID IN (' . $queryString . ')'
      ) === false)
        return false;

      //delete video thumbnails
      foreach ($videos as $video)
        unlink(self::$_basePath . $video['VID_URL'] . $video['VID_ID'] . '.jpg');

      return true;
    }

    public static function deleteGalleries($galleries, &$wpdb)
    {
      $albumIdArray = [];

      //sanitize key array
      $galleriesQueryString = implode(', ', array_map('intval', $galleries));

      //get albums within gallery//
      $albums = $wpdb->get_results('SELECT ALB_ID FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID IN (' . $galleriesQueryString . ')', ARRAY_A);

      foreach ($albums as $val)
        array_push($albumIdArray, $val['ALB_ID']);

      $albumsQueryString = (count($albumIdArray) == 0 ? 'null' : implode(', ', array_map('intval', $albumIdArray)));

      $videos = $wpdb->get_results('SELECT VID_ID, VID_URL FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID IN (' . $albumsQueryString . ')', ARRAY_A);

      //delete video data and update album count
      if ($wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID IN (' . $albumsQueryString . ')'
      ) === false || $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_ID IN (' . $albumsQueryString . ')'
      ) === false || $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_dataset WHERE DATA_ID IN (' . $galleriesQueryString . ')'
      ) === false)
        return false;

      //delete video thumbnails
      foreach ($videos as $video)
        unlink(self::$_basePath . $video['VID_URL'] . $video['VID_ID'] . '.jpg');

      return true;
    }

    public static function deletePlaylists($playlists, &$wpdb)
    {
      //sanitize key array
      $playlistsQueryString = implode(', ', array_map('intval', $playlists));

      //query database for video ids in playlist
      $videos = $wpdb->get_results('SELECT VID_ID FROM ' . $wpdb->prefix . 'utubevideo_video WHERE PLAY_ID IN (' . $playlistsQueryString . ')', ARRAY_A);
      $videoIDs = [];

      //build correct array format of ids
      foreach ($videos as $video)
        array_push($videoIDs, $video['VID_ID']);

      //delete videos
      if (!self::deleteVideos($videoIDs, $wpdb))
        return false;

      //delete playlist records
      if ($wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_playlist WHERE PLAY_ID IN (' . $playlistsQueryString . ')'
      ) === false)
        return false;

      return true;
    }

    public static function toggleVideosPublish($videos, $status, &$wpdb)
    {
      //sanitize key array
      $queryString = implode(', ', array_map('intval', $videos));

      //update videos to chosen status
      if (!$wpdb->query('UPDATE ' . $wpdb->prefix . 'utubevideo_video SET VID_PUBLISH = ' . $status . ' WHERE VID_ID IN (' . $queryString . ')'))
        return false;

      return true;
    }

    public static function toggleAlbumsPublish($albums, $status, &$wpdb)
    {
      //sanitize key array
      $queryString = implode(', ', array_map('intval', $albums));

      //update videos to chosen status
      if (!$wpdb->query('UPDATE ' . $wpdb->prefix . 'utubevideo_album SET ALB_PUBLISH = ' . $status . ' WHERE ALB_ID IN (' . $queryString . ')'))
        return false;

      return true;
    }

    public static function refreshThumbnails($videos, &$wpdb)
    {
      //sanitize key array
      $queryString = implode(', ', array_map('intval', $videos));

      //get data from database
      $videoData = $wpdb->get_results('SELECT VID_ID, VID_URL, VID_SOURCE, VID_THUMBTYPE, DATA_THUMBTYPE FROM ' . $wpdb->prefix . 'utubevideo_video v JOIN ' . $wpdb->prefix . 'utubevideo_album a ON (v.ALB_ID = a.ALB_ID) JOIN ' . $wpdb->prefix . 'utubevideo_dataset d ON (a.DATA_ID = d.DATA_ID) WHERE VID_ID IN (' . $queryString . ')', ARRAY_A);

      //reprocess each video thumbnail
      foreach ($videoData as $video)
      {
        if ($video['VID_SOURCE'] == 'vimeo')
        {
          $data = utvAdminGen::queryAPI('https://vimeo.com/api/v2/video/' . $video['VID_URL'] . '.json')[0];
          $sourceURL = $data['thumbnail_large'];
        }
        else
          $sourceURL = 'https://img.youtube.com/vi/' . $video['VID_URL'] . '/0.jpg';

        //resave video thumbnail
        utvAdminGen::saveThumbnail($sourceURL, $video['VID_URL'] . $video['VID_ID'], $video['DATA_THUMBTYPE'], true);

        //update thumbnail type in database if needed - compatibilty
        if ($video['VID_THUMBTYPE'] != $video['DATA_THUMBTYPE'])
        {
          $wpdb->update(
            $wpdb->prefix . 'utubevideo_video',
            ['VID_THUMBTYPE' => $video['DATA_THUMBTYPE']],
            ['VID_ID' => $video['VID_ID']]
          );
        }
      }
    }

    //generate album permalink slug
    public static function generateSlug($albumName, &$wpdb)
    {
      $rawslugs = $wpdb->get_results('SELECT ALB_SLUG FROM ' . $wpdb->prefix . 'utubevideo_album', ARRAY_N);

      foreach ($rawslugs as $item)
        $sluglist[] = $item[0];

      $mark = 1;
      $slug = strtolower($albumName);
      $slug = str_replace(' ', '-', $slug);
      $slug = html_entity_decode($slug, ENT_QUOTES, 'UTF-8');
      $slug = preg_replace("/[^a-zA-Z0-9-]+/", '', $slug);

      if (!empty($sluglist))
        self::checkslug($slug, $sluglist, $mark);

      return $slug;
    }

    //print message to user
    public static function printMessage($message, $type, $dismissible = true, $autoHide = false)
    {
      $classString = 'notice';

      if ($dismissible)
        $classString .= ' is-dismissible';

      if ($autoHide)
        $classString .= ' updated';

      if ($type == 'success')
        $classString .= ' notice-success';
      elseif ($type == 'warning')
        $classString .= ' notice-warning';
      elseif ($type == 'info')
        $classString .= ' notice-info';
      else
        $classString .= ' notice-error';

      echo '<div class="' . $classString . '"><p>' . $message . '</p></div>';
    }

    //checks if string is null or empty - needs work
    public static function isNullOrEmpty($value)
    {
      return (!isset($value) || trim($value) === '');
    }

    public static function hasValue($value, $target)
    {
      return (isset($value) && $value == $target);
    }

    public static function getYouTubePlaylistData($apiKey, $playlistID)
    {
      //return array of data
      $return = ['title' => '', 'videos' => []];

      //check for a possibly valid api key before continuing
      if (self::isNullOrEmpty($apiKey))
        return false;

      //retrieve playlist title
      if ($data = self::queryAPI('https://www.googleapis.com/youtube/v3/playlists?key=' . $apiKey . '&part=snippet&id=' . $playlistID))
      {
        if (isset($data['items'][0]['snippet']['title']))
          $return['title'] = htmlspecialchars($data['items'][0]['snippet']['title']);
      }

      //get base data from youtube api
      $nextPageToken = true;
      $baseData = [];

      while ($nextPageToken)
      {
        if (!$data = self::queryAPI('https://www.googleapis.com/youtube/v3/playlistItems?key=' . $apiKey . '&part=snippet&maxResults=50&playlistId=' . $playlistID . (strlen($nextPageToken) > 1 ? '&pageToken=' . $nextPageToken : '')))
          return false;

        if (isset($data['items']))
          $baseData = array_merge($baseData, $data['items']);

        if (isset($data['nextPageToken']))
          $nextPageToken = $data['nextPageToken'];
        else
          $nextPageToken = false;
      }

      //generate video id strings to get additonal details needed to filter out deleted and private videos
      $videoIDsList = [];
      $IDString = '';
      $IDCount = 0;

      foreach ($baseData as $item)
      {
        if (isset($item['snippet']['resourceId']['videoId']))
        {
          $IDString .= $item['snippet']['resourceId']['videoId'] . ',';
          $IDCount++;
        }

        if ($IDCount == 50)
        {
          array_push($videoIDsList, trim($IDString, ','));
          $IDString = '';
          $IDCount = 0;
        }
      }

      if ($IDCount > 0)
        array_push($videoIDsList, trim($IDString, ','));

      //reuse basedata array
      $baseData = [];

      //get final video data to filter with
      foreach ($videoIDsList as $list)
      {
        if (!$data = self::queryAPI('https://www.googleapis.com/youtube/v3/videos?key=' . $apiKey . '&part=contentDetails,snippet,status&id=' . $list))
          return false;

        if (isset($data['items']))
          $baseData = array_merge($baseData, $data['items']);
      }

      //filter video and if passed add it to album dataset
      foreach ($baseData as $video)
      {
        if (!self::hasValue($video['status']['uploadStatus'], 'rejected') && self::hasValue($video['status']['embeddable'], true) && self::hasValue($video['status']['privacyStatus'], 'public'))
        {
          $duration = new DateTime('@0');
          $duration->add(new DateInterval($video['contentDetails']['duration']));
          $duration = $duration->format('H:i:s');

          array_push(
            $return['videos'],
            [
              'title' => htmlspecialchars($video['snippet']['title'], ENT_QUOTES),
              'videoId' => $video['id'],
              'thumbURL' => 'https://img.youtube.com/vi/' . $video['id'] . '/0.jpg',
              'duration' => $duration
            ]
          );
        }
      }

      return $return;
    }

    public static function getVimeoPlaylistData($playlistID)
    {
      //return array of data
      $return = ['title' => '', 'videos' => []];
      //basedata array
      $baseData = [];

      if (!$albumData = self::queryAPI('https://vimeo.com/api/v2/album/' . $playlistID . '/info.json'))
        return false;

      //retrieve playlist title
      if (isset($albumData['title']))
        $return['title'] = $albumData['title'];

      //retreive playlist total videos
       if ($albumData['total_videos'] >= 60)
         $pages = 3;
       else
         $pages = ceil($albumData['total_videos'] / 20);

       for ($i = 1; $i <= $pages; $i++)
       {
         if (!$data = self::queryAPI('https://vimeo.com/api/v2/album/' . $playlistID . '/videos.json?page=' . $i))
           return false;

         $baseData = array_merge($baseData, $data);
       }

       foreach ($data as $val)
       {
         $duration = gmdate('H:i:s', $val['duration']);
         array_push(
           $return['videos'],
           [
             'title' => htmlspecialchars($val['title'], ENT_QUOTES),
             'videoId' => $val['id'],
             'thumbURL' => $val['thumbnail_large'],
             'duration' => $duration
           ]
         );
       }

      return $return;
    }

    //update single local video in playlist
    public static function updateLocalPlaylistVideo($videoTitle, $videoQuality, $videoChrome, $localID, &$wpdb)
    {
      if (!isset($videoTitle) ||
        !isset($videoQuality) ||
        !isset($videoChrome) ||
        !isset($localID) ||
        !isset($wpdb)
      )
        return false;

      if ($wpdb->update(
        $wpdb->prefix . 'utubevideo_video',
        [
          'VID_NAME' => $videoTitle,
          'VID_QUALITY' => $videoQuality,
          'VID_CHROME' => $videoChrome
        ],
        ['VID_ID' => $localID]
      ) < 0)
        return false;
      else
        return true;
    }

    //insert single new video in playlist
    public static function insertNewPlaylistVideo($videoTitle, $videoSource, $videoSourceID, $videoThumbType, $videoThumbURL, $videoQuality, $videoChrome, $sortPosition, $albumID, $playlistID, $wpdb)
    {
      if (!isset($videoTitle) ||
        !isset($videoSource) ||
        !isset($videoSourceID) ||
        !isset($videoThumbType) ||
        !isset($videoThumbURL) ||
        !isset($videoQuality) ||
        !isset($videoChrome) ||
        !isset($sortPosition) ||
        !isset($albumID) ||
        !isset($playlistID) ||
        !isset($wpdb)
      )
        return false;

      //get current timestamp
      $time = current_time('timestamp');

      //if video insertion successful; save thumbnail and increment new video count++
      if ($wpdb->insert(
        $wpdb->prefix . 'utubevideo_video',
        [
          'VID_SOURCE' => $videoSource,
          'VID_NAME' => $videoTitle,
          'VID_URL' => $videoSourceID,
          'VID_THUMBTYPE' => $videoThumbType,
          'VID_QUALITY' => $videoQuality,
          'VID_CHROME' => $videoChrome,
          'VID_POS' => $sortPosition,
          'VID_UPDATEDATE' => $time,
          'ALB_ID' => $albumID,
          'PLAY_ID' => $playlistID
        ]
      ))
      {
        $videoID = $wpdb->insert_id;

        if (!utvAdminGen::saveThumbnail($videoThumbURL, $videoSourceID . $videoID, $videoThumbType, true))
        {
          $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_video WHERE VID_ID ="' . $videoID . '"');
          return false;
        }
        else
          return true;
      }
      else
        return false;
    }

    //recursive function for making sure slugs are unique
    private static function checkslug(&$slug, &$sluglist, &$mark)
    {
      if (in_array($slug, $sluglist))
      {
        $slug = $slug . '-' . $mark;
        $mark++;
        self::checkslug($slug, $sluglist, $mark);
      }
      else
        return;
    }
  }
}

?>
