<?php

namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use WP_REST_Request;
use WP_REST_Server;
use stdClass;

class GalleryAPIv1 extends APIv1
{
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

    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'galleries/(?P<galleryID>\d+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'args' => [
            'galleryID'
          ],
          'permission_callback' => function() {
            return true;
            //return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'createItem'],
          'args' => [
            'galleryID'
          ],
          'permission_callback' => function() {
            return true;
            //return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'deleteItem'],
          'args' => [
            'galleryID'
          ],
          'permission_callback' => function() {
            return true;
            //return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => 'PATCH',
          'callback' => [$this, 'updateItem'],
          'args' => [
            'galleryID'
          ],
          'permission_callback' => function() {
            return true;
            //return current_user_can('edit_others_posts');
          }
        ]
      ]
    );
  }


  public function getItem(WP_REST_Request $req)
  {
    $galleryData = new stdClass();

    global $wpdb;
    $gallery = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_dataset WHERE DATA_ID = ' . $req['galleryID']);

    if (!$gallery)
      return $this->errorResponse('The specified gallery resource was not found');

    $gallery = $gallery[0];
    $albumCount = $wpdb->get_results('SELECT COUNT(ALB_ID) AS ALBUM_COUNT FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $req['galleryID']);

    if ($albumCount)
      $albumCount = $albumCount[0]->ALBUM_COUNT;
    else
      $albumCount = 0;

    $galleryData->id = $gallery->DATA_ID;
    $galleryData->title = $gallery->DATA_NAME;
    $galleryData->sortDirection = $gallery->DATA_SORT;
    $galleryData->displayType = $gallery->DATA_DISPLAYTYPE;
    $galleryData->updateDate = $gallery->DATA_UPDATEDATE;
    $galleryData->albumCount = $albumCount;
    $galleryData->thumbnailType = $gallery->DATA_THUMBTYPE;

    return $this->response($galleryData);
  }

  public function createItem(WP_REST_Request $req)
  {

  }

  public function deleteItem(WP_REST_Request $req)
  {

  }

  public function updateItem(WP_REST_Request $req)
  {

  }

  public function getAllItems(WP_REST_Request $req)
  {
    $data = [];

    global $wpdb;
    $galleries = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_dataset ORDER BY DATA_ID');

    foreach ($galleries as $gallery)
    {
      $albumCount = $wpdb->get_results('SELECT COUNT(ALB_ID) AS ALBUM_COUNT FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $gallery->DATA_ID);

      if ($albumCount)
        $albumCount = $albumCount[0]->ALBUM_COUNT;
      else
        $albumCount = 0;

      $galleryData = new stdClass();
      $galleryData->id = $gallery->DATA_ID;
      $galleryData->title = $gallery->DATA_NAME;
      $galleryData->sortDirection = $gallery->DATA_SORT;
      $galleryData->displayType = $gallery->DATA_DISPLAYTYPE;
      $galleryData->updateDate = $gallery->DATA_UPDATEDATE;
      $galleryData->albumCount = $albumCount;
      $galleryData->thumbnailType = $gallery->DATA_THUMBTYPE;

      $data[] = $galleryData;
    }

    return $this->response($data);
  }
}
