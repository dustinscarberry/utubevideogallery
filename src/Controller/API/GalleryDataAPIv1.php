<?php

namespace UTubeVideoGallery\Controller\API;

use WP_REST_Request;
use WP_REST_Server;
use stdClass;

class GalleryDataAPIv1
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
      '/galleriesdata/(?P<galleryID>\d+)',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getItem'],
        'args' => [
          'galleryID'
        ]
      ]
    );
  }

  public function getItem(WP_REST_Request $req)
  {
    try
    {
      $data = new stdClass();
      $thumbnailDirectory = wp_upload_dir();
      $thumbnailDirectory = $thumbnailDirectory['baseurl'];
      global $wpdb;

      //get gallery data
      $gallery = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_dataset WHERE DATA_ID = "' . $req['galleryID'] . '"');
      $gallery = $gallery[0];

      $data->ID = $gallery->DATA_ID;
      $data->name = $gallery->DATA_NAME;
      $data->displaytype = $gallery->DATA_DISPLAYTYPE;
      $data->thumbnailType = $gallery->DATA_THUMBTYPE;
      $data->albumsort = $gallery->DATA_SORT;
      $data->albums = [];

      //get video albums
      $albums = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_PUBLISH = 1 && DATA_ID = ' . $gallery->DATA_ID);

      foreach ($albums as $album)
      {
        $albumData = new stdClass();
        $albumData->ID = $album->ALB_ID;
        $albumData->title = $album->ALB_NAME;
        $albumData->slug = $album->ALB_SLUG;
        $albumData->thumbnail = $thumbnailDirectory . '/utubevideo-cache/' . $album->ALB_THUMB . '.jpg';
        $albumData->sort = $album->ALB_SORT;
        $albumData->position = $album->ALB_POS;
        $albumData->videos = [];

        //get videos for album
        $videos = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $album->ALB_ID . ' && VID_PUBLISH = 1 ORDER BY VID_POS ' . $album->ALB_SORT);

        foreach ($videos as $video)
        {
          $videoData = new stdClass();
          $videoData->ID = $video->VID_ID;
          $videoData->title = $video->VID_NAME;
          $videoData->description = $video->VID_DESCRIPTION;
          $videoData->slugID = $video->VID_URL;
          $videoData->thumbnail = $thumbnailDirectory . '/utubevideo-cache/' . $video->VID_URL . $video->VID_ID . '.jpg';
          $videoData->source = $video->VID_SOURCE;
          $videoData->quality = $video->VID_QUALITY;
          $videoData->chrome = $video->VID_CHROME == 1 ? true : false;
          $videoData->startTime = $video->VID_STARTTIME;
          $videoData->endTime = $video->VID_ENDTIME;

          $albumData->videos[] = $videoData;
        }

        $data->albums[] = $albumData;
      }

      return $data;
    }
    catch (\Exception $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }
}
