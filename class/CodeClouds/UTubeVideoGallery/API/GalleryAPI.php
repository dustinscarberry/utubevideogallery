<?php

namespace CodeClouds\UTubeVideoGallery\API;

use WP_REST_Request;
use WP_REST_Server;

class GalleryAPI
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
      '/galleries',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAllItems']
      ]
    );
  }

  public function getAllItems(WP_REST_Request $req)
  {
    $data = [];
    global $wpdb;

    $galleries = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_dataset ORDER BY DATA_ID');

    foreach ($galleries as $gallery)
    {
      $albumCount = $wpdb->get_results('SELECT COUNT(ALB_ID) AS ALBUM_COUNT FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $gallery->DATA_ID)[0];

      $galleryData = [];
      $galleryData['id'] = $gallery->DATA_ID;
      $galleryData['title'] = $gallery->DATA_NAME;
      $galleryData['sortDirection'] = $gallery->DATA_SORT;
      $galleryData['displayType'] = $gallery->DATA_DISPLAYTYPE;
      $galleryData['updateDate'] = $gallery->DATA_UPDATEDATE;
      $galleryData['albumCount'] = $albumCount->ALBUM_COUNT;
      $galleryData['thumbnailType'] = $gallery->DATA_THUMBTYPE;

      $data[] = $galleryData;
    }

    return $data;
  }
}
