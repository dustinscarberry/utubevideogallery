<?php

if (!class_exists('utvAdminAjax'))
{
  class utvAdminAjax
  {
    private $_options;

    public function __construct($options)
    {
      require_once(dirname(__FILE__) . '/../class/utvAdminGen.class.php');

      $this->_options = $options;
      utvAdminGen::initialize($this->_options);

      //register ajax hooks
      add_action('wp_ajax_utv_videoorderupdate', array($this, 'updateVideoOrder'));
      add_action('wp_ajax_utv_albumorderupdate', array($this, 'updateAlbumOrder'));
      add_action('wp_ajax_ut_deletevideo', array($this, 'deleteVideo'));
      add_action('wp_ajax_ut_deletealbum', array($this, 'deleteAlbum'));
      add_action('wp_ajax_ut_deletegallery', array($this, 'deleteGallery'));
      add_action('wp_ajax_utv_deleteplaylist', array($this, 'deletePlaylist'));
      add_action('wp_ajax_ut_publishvideo', array($this, 'toggleVideoPublish'));
      add_action('wp_ajax_ut_publishalbum', array($this, 'toggleAlbumPublish'));
      add_action('wp_ajax_utv_fetchyoutubeplaylist', array($this, 'fetchYoutubePlaylist'));
      add_action('wp_ajax_utv_fetchvimeoplaylist', array($this, 'fetchVimeoPlaylist'));
    }

    public function updateVideoOrder()
    {
      global $wpdb;
      $data = explode(',', $_POST['order']);

      $cnt = count($data);

      for ($i = 0; $i < $cnt; $i++)
      {
        $wpdb->update(
          $wpdb->prefix . 'utubevideo_video',
          array(
            'VID_POS' => $i
          ),
          array('VID_ID' => $data[$i])
        );
      }

      die();
    }

    public function updateAlbumOrder()
    {
      global $wpdb;
      $data = explode(',', $_POST['order']);

      $cnt = count($data);

      for ($i = 0; $i < $cnt; $i++)
      {
        $wpdb->update(
          $wpdb->prefix . 'utubevideo_album',
          array(
            'ALB_POS' => $i
          ),
          array('ALB_ID' => $data[$i])
        );
      }

      die();
    }

    //delete a video script//
    public function deleteVideo()
    {
      check_ajax_referer('ut-delete-video', 'nonce');

      $key = array(sanitize_key($_POST['key']));

      global $wpdb;

      if (utvAdminGen::deleteVideos($key, $wpdb))
        echo 1;
      else
        echo 0;

      die();
    }

    //delete an album script//
    public function deleteAlbum()
    {
      check_ajax_referer('ut-delete-album', 'nonce');

      $key = array(sanitize_key($_POST['key']));

      global $wpdb;

      if (utvAdminGen::deleteAlbums($key, $wpdb))
        echo 1;
      else
        echo 0;

      die();
    }

    //delete a gallery script//
    public function deleteGallery()
    {
      check_ajax_referer('ut-delete-gallery', 'nonce');

      $key = array(sanitize_key($_POST['key']));

      global $wpdb;

      if (utvAdminGen::deleteGalleries($key, $wpdb))
        echo 1;
      else
        echo 0;

      die();
    }

    //delete a playlist script//
    public function deletePlaylist()
    {
      check_ajax_referer('utv-delete-playlist', 'nonce');

      $key = array(sanitize_key($_POST['key']));

      global $wpdb;

      if (utvAdminGen::deletePlaylists($key, $wpdb))
        echo 1;
      else
        echo 0;

      die();
    }

    public function toggleVideoPublish()
    {
      check_ajax_referer('ut-publish-video', 'nonce');

      $key = array(sanitize_key($_POST['key']));
      $changeTo = sanitize_text_field($_POST['changeTo']);

      global $wpdb;

      if (utvAdminGen::toggleVideosPublish($key, $changeTo, $wpdb))
        echo 1;

      die();
    }

    public function toggleAlbumPublish()
    {
      check_ajax_referer('ut-publish-album', 'nonce');

      $key = array(sanitize_key($_POST['key']));
      $changeTo = sanitize_text_field($_POST['changeTo']);

      global $wpdb;

      if (utvAdminGen::toggleAlbumsPublish($key, $changeTo, $wpdb))
        echo 1;

      die();
    }

    public function fetchYoutubePlaylist()
    {
      //check referrer
      check_ajax_referer('ut-retrieve-playlist', 'nonce');

      //sanitize user input
      $url = sanitize_text_field($_POST['url']);
      //datastruct to return
      $return = array('valid' => true, 'message' => '', 'data' => array('title' => '', 'videos' => array()));

      //check for a possibly valid api key before continuing
      if (!utvAdminGen::isNullOrEmpty($this->_options['youtubeApiKey']))
      {
        //parse video url to get video id//
        if (!$playlistID = utvAdminGen::parseURL($url, 'youtube', 'playlist'))
        {
          $return['valid'] = false;
          $return['message'] = __('Invalid URL.', 'utvg');
          wp_send_json($return);
        }

        $return['data'] = utvAdminGen::getYouTubePlaylistData($this->_options['youtubeApiKey'], $playlistID);

        if (!$return['data'])
        {
          $return['valid'] = false;
          $return['message'] = __('Internal error.', 'utvg');
        }
      }
      else
      {
        $return['valid'] = false;
        $return['message'] = __('You must have a valid API key set in the settings menu.', 'utvg');
      }

      //return json
      wp_send_json($return);
    }

    public function fetchVimeoPlaylist()
    {
      //check referrer
      check_ajax_referer('ut-retrieve-playlist', 'nonce');

      //sanitize user input
      $url = sanitize_text_field($_POST['url']);
      //datastruct to return
      $return = array('valid' => true, 'message' => '', 'data' => array('title' => '', 'videos' => array()));

      if (!$albumID = utvAdminGen::parseURL($url, 'vimeo', 'playlist'))
      {
        $return['valid'] = false;
        $return['message'] = __('Invalid URL.', 'utvg');
        wp_send_json($return);
      }

      $return['data'] = utvAdminGen::getVimeoPlaylistData($albumID);

      wp_send_json($return);
    }
  }
}

?>
