<?php

namespace CodeClouds\UTubeVideoGallery\API;

use WP_REST_Request;
use WP_REST_Server;
use stdClass;

class AlbumAPI
{
  private $_namespace = 'utubevideogallery';
  private $_version = 'v1';

  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'galleries/(?P<id>\d+)/albums',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAllItems'],
        'args' => [
          'id'
        ]
      ]
    );
  }

  public function getAllItems(WP_REST_Request $req)
  {
    $data = [];
    $thumbnailDirectory = wp_upload_dir()['baseurl'];
    global $wpdb;

    $albums = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $req['id'] . ' ORDER BY ALB_POS');

    if (!$albums)
      return null;

    foreach ($albums as $album)
    {
      $videoCount = $wpdb->get_results('SELECT count(VID_ID) as VIDEO_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $album->ALB_ID)[0];

      $albumData = new stdClass();
      $albumData->id = $album->ALB_ID;
      $albumData->title = $album->ALB_NAME;
      $albumData->slug = $album->ALB_SLUG;
      $albumData->thumbnail = $thumbnailDirectory . '/utubevideo-cache/' . $album->ALB_THUMB . '.jpg';
      $albumData->sortDirection = $album->ALB_SORT;
      $albumData->position = $album->ALB_POS;
      $albumData->published = $album->ALB_PUBLISH;
      $albumData->updateDate = $album->ALB_UPDATEDATE;
      $albumData->videoCount = $videoCount->VIDEO_COUNT;
      $albumData->galleryID = $album->DATA_ID;

      $data[] = $albumData;
    }

    return $data;
  }
}
