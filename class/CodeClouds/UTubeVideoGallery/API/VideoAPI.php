<?php

namespace CodeClouds\UTubeVideoGallery\API;

use WP_REST_Request;
use WP_REST_Server;
use stdClass;

class VideoAPI
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
      'albums/(?P<albumID>\d+)/videos',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAllItems'],
        'args' => [
          'galleryID',
          'albumID'
        ]
      ]
    );
  }

  /*



  /videos/id

  getItem
  updateItem
  createItem
  deleteItem


  /albums/id

   



  /videos




  */

  public function getAllItems(WP_REST_Request $req)
  {
    $data = [];
    $thumbnailDirectory = wp_upload_dir()['baseurl'];
    global $wpdb;

    $videos = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $req['albumID'] . ' ORDER BY VID_POS');

    if (!$videos)
      return null;

    foreach ($videos as $video)
    {
      $videoData = new stdClass();
      $videoData->id = $video->VID_ID;
      $videoData->title = $video->VID_NAME;
      $videoData->source = $video->VID_SOURCE;
      $videoData->thumbnail = $thumbnailDirectory . '/utubevideo-cache/' . $video->VID_URL . $video->VID_ID . '.jpg';
      $videoData->url = $video->VID_URL;
      $videoData->quality = $video->VID_QUALITY;
      $videoData->showChrome = $video->VID_CHROME;
      $videoData->startTime = $video->VID_STARTTIME;
      $videoData->endTime = $video->VID_ENDTIME;
      $videoData->position = $video->VID_POS;
      $videoData->published = $video->VID_PUBLISH;
      $videoData->updateDate = $video->VID_UPDATEDATE;
      $videoData->albumID = $video->ALB_ID;

      $data[] = $videoData;
    }

    return $data;
  }
}
