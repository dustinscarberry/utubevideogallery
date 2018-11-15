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
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getAllItems']
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'createItem'],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ]
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
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'deleteItem'],
          'args' => [
            'galleryID'
          ],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => 'PATCH',
          'callback' => [$this, 'updateItem'],
          'args' => [
            'galleryID'
          ],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ]
      ]
    );
  }

  public function getItem(WP_REST_Request $req)
  {
    $galleryData = new stdClass();

    //check for valid galleryID
    if (!$req['galleryID'])
      return $this->errorResponse('Invalid gallery ID');

    //sanitize data
    $galleryID = sanitize_key($req['galleryID']);

    global $wpdb;
    $gallery = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_dataset WHERE DATA_ID = ' . $galleryID);

    if (!$gallery)
      return $this->errorResponse('The specified gallery resource was not found');

    $gallery = $gallery[0];
    $albumCount = $wpdb->get_results('SELECT COUNT(ALB_ID) AS ALBUM_COUNT FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $galleryID);

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
    global $wpdb;

    //gather data fields
    $title = sanitize_text_field($req['title']);
    $albumSorting = sanitize_text_field($req['albumSorting'] == 'desc' ? 'desc' : 'asc');
    $thumbnailType = sanitize_text_field($req['thumbnailType'] == 'square' ? 'square' : 'rectangle');
    $displayType = sanitize_text_field($req['displayType'] == 'video' ? 'video' : 'album');
    $time = current_time('timestamp');

    //check for required fields
    if (empty($title) || empty($albumSorting) || empty($thumbnailType) || empty($displayType))
      return $this->errorResponse('Invalid parameters');

    //insert new gallery
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_dataset',
      [
        'DATA_NAME' => $title,
        'DATA_SORT' => $albumSorting,
        'DATA_THUMBTYPE' => $thumbnailType,
        'DATA_DISPLAYTYPE' => $displayType,
        'DATA_UPDATEDATE' => $time
      ]
    ))
      return $this->response(null, 201);
    else
      return $this->errorResponse('A database error has occurred');
  }

  public function deleteItem(WP_REST_Request $req)
  {
    global $wpdb;

    //check for valid galleryID
    if (!$req['galleryID'])
      return $this->errorResponse('Invalid gallery ID');

    //sanitize fields
    $galleryID = sanitize_key($req['galleryID']);

    //get albums within gallery
    $albums = $wpdb->get_results('SELECT ALB_ID FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID =' . $galleryID);
    $albumIDs = [-1];

    foreach ($albums as $album)
      $albumIDs[] = $album->ALB_ID;

    $albumsQueryString = implode(', ', $albumIDs);

    $videos = $wpdb->get_results('SELECT VID_ID, VID_URL FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID IN (' . $albumsQueryString . ')');

    //delete video data and update album count
    if (
      $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID IN (' . $albumsQueryString . ')') === false
      || $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_ID IN (' . $albumsQueryString . ')') === false
      || $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_dataset WHERE DATA_ID = ' . $galleryID) === false
    )
      return $this->errorResponse('A database error has occurred');

    //delete video thumbnails
    $thumbnailPath = (wp_upload_dir())['basedir'] . '/utubevideo-cache/';

    foreach ($videos as $video)
      unlink($thumbnailPath . $video->VID_URL . $video->VID_ID . '.jpg');

      echo 'out';

    return $this->response(null);
  }

  public function updateItem(WP_REST_Request $req)
  {
    global $wpdb;

    //check for valid galleryID
    if (!$req['galleryID'])
      return $this->errorResponse('Invalid gallery ID');

    //gather data fields
    $galleryID = sanitize_key($req['galleryID']);
    $title = sanitize_text_field($req['title']);

    if (isset($req['albumSorting']))
      $albumSorting = $req['albumSorting'] == 'desc' ? 'desc' : 'asc';
    else
      $albumSorting = null;

    $thumbnailType = sanitize_text_field($req['thumbnailType']);
    $displayType = sanitize_text_field($req['displayType']);
    $currentTime = current_time('timestamp');

    //create updatedFields array
    $updatedFields = [];

    //set optional update fields
    if ($title != null)
      $updatedFields['DATA_NAME'] = $title;

    if ($thumbnailType != null)
      $updatedFields['DATA_THUMBTYPE'] = $thumbnailType;

    if ($displayType != null)
      $updatedFields['DATA_DISPLAYTYPE'] = $displayType;

    if ($albumSorting != null)
      $updatedFields['DATA_SORT'] = $albumSorting;

    //set required update fields
    $updatedFields['DATA_UPDATEDATE'] = $currentTime;

    //update database entry
    if ($wpdb->update(
      $wpdb->prefix . 'utubevideo_dataset',
      $updatedFields,
      ['DATA_ID' => $galleryID]
    ) >= 0)
      return $this->response(null);
    else
      return $this->errorResponse('A database error has occurred');
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
