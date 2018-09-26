<?php
namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use WP_REST_Request;
use WP_REST_Server;
use stdClass;

class AlbumAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'galleries/(?P<galleryID>\d+)/albums',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAllItems'],
        'args' => [
          'galleryID'
        ]
      ]
    );

    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'albums/(?P<albumID>\d+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'args' => [
            'albumID'
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
            'albumID'
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
            'albumID'
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
            'albumID'
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
    $albumData = new stdClass();
    $thumbnailDirectory = wp_upload_dir()['baseurl'];

    global $wpdb;
    $album = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_ID = ' . $req['albumID']);

    if (!$album)
      return $this->errorResponse('The specified album resource was not found');

    $album = $album[0];
    $videoCount = $wpdb->get_results('SELECT count(VID_ID) as VIDEO_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $req['albumID']);

    if ($videoCount)
      $videoCount = $videoCount[0]->VIDEO_COUNT;
    else
      $videoCount = 0;

    $albumData->id = $album->ALB_ID;
    $albumData->title = $album->ALB_NAME;
    $albumData->slug = $album->ALB_SLUG;
    $albumData->thumbnail = $thumbnailDirectory . '/utubevideo-cache/' . $album->ALB_THUMB . '.jpg';
    $albumData->sortDirection = $album->ALB_SORT;
    $albumData->position = $album->ALB_POS;
    $albumData->published = $album->ALB_PUBLISH;
    $albumData->updateDate = $album->ALB_UPDATEDATE;
    $albumData->videoCount = $videoCount;
    $albumData->galleryID = $album->DATA_ID;

    return $this->response($albumData);
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
    $thumbnailDirectory = wp_upload_dir()['baseurl'];

    global $wpdb;
    $albums = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $req['galleryID'] . ' ORDER BY ALB_POS');
    
    foreach ($albums as $album)
    {
      $videoCount = $wpdb->get_results('SELECT count(VID_ID) as VIDEO_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $req['galleryID']);

      if ($videoCount)
        $videoCount = $videoCount[0]->VIDEO_COUNT;
      else
        $videoCount = 0;

      $albumData = new stdClass();
      $albumData->id = $album->ALB_ID;
      $albumData->title = $album->ALB_NAME;
      $albumData->slug = $album->ALB_SLUG;
      $albumData->thumbnail = $thumbnailDirectory . '/utubevideo-cache/' . $album->ALB_THUMB . '.jpg';
      $albumData->sortDirection = $album->ALB_SORT;
      $albumData->position = $album->ALB_POS;
      $albumData->published = $album->ALB_PUBLISH;
      $albumData->updateDate = $album->ALB_UPDATEDATE;
      $albumData->videoCount = $videoCount;
      $albumData->galleryID = $album->DATA_ID;

      $data[] = $albumData;
    }

    return $this->response($data);
  }
}