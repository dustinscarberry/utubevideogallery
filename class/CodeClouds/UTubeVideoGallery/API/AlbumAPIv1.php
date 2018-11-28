<?php

namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use WP_REST_Request;
use WP_REST_Server;
use stdClass;
use utvAdminGen;

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
      'albums',
      [
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'createItem'],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getAnyAllItems'],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
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
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'deleteItem'],
          'args' => [
            'albumID'
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
            'albumID'
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
    //check for valid albumID
    if (!$req['albumID'])
      return $this->errorResponse('Invalid album ID');

    $albumData = new stdClass();
    $albumID = sanitize_key($req['albumID']);

    global $wpdb;
    $album = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_ID = ' . $albumID);

    if (!$album)
      return $this->errorResponse('The specified album resource was not found');

    $album = $album[0];
    $videoCount = $wpdb->get_results('SELECT count(VID_ID) as VIDEO_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $albumID);

    if ($videoCount)
      $videoCount = $videoCount[0]->VIDEO_COUNT;
    else
      $videoCount = 0;

    $albumData->id = $album->ALB_ID;
    $albumData->title = $album->ALB_NAME;
    $albumData->slug = $album->ALB_SLUG;
    $albumData->thumbnail = $album->ALB_THUMB;
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
    //require helper classes
    //require_once(dirname(__FILE__) . '/../../../utvAdminGen.php');
    //utvAdminGen::initialize([]);

    global $wpdb;

    //gather data fields
    $title = sanitize_text_field($req['title']);
    $videoSorting = ($req['videoSorting'] == 'desc' ? 'desc' : 'asc');
    $galleryID = sanitize_key($req['galleryID']);
    $time = current_time('timestamp');

    //check for required fields
    if (empty($title) || empty($videoSorting) || !isset($galleryID))
      return $this->errorResponse('Invalid parameters');

    //get next album sorting position
    $nextAlbumPosition = $wpdb->get_results('SELECT COUNT(ALB_ID) AS ALBUM_COUNT FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $galleryID);

    if ($nextAlbumPosition)
      $nextAlbumPosition = $nextAlbumPosition[0]->ALBUM_COUNT;
    else
      $nextAlbumPosition = 0;

    //generate slug and store for possible use in future
    $slug = $this->generateSlug($title, $wpdb);

    //insert new album
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_album',
      [
        'ALB_NAME' => $title,
        'ALB_SLUG' => $slug,
        'ALB_THUMB' => 'missing',
        'ALB_SORT' => $videoSorting,
        'ALB_UPDATEDATE' => $time,
        'ALB_POS' => $nextAlbumPosition,
        'DATA_ID' => $galleryID
      ]
    ))
      return $this->response(null, 201);
    else
      return $this->errorResponse('A database error has occurred');
  }

  public function deleteItem(WP_REST_Request $req)
  {
    global $wpdb;

    //check for valid albumID
    if (!$req['albumID'])
      return $this->errorResponse('Invalid album ID');

    //sanitize fields
    $albumID = sanitize_key($req['albumID']);

    //get all videos in album
    $videos = $wpdb->get_results('SELECT VID_ID, VID_URL FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $albumID);

    //delete album and video data
    if (
      $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $albumID) === false
      || $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_ID =' . $albumID) === false
    )
      return $this->errorResponse('A database error has occurred');

    $thumbnailPath = (wp_upload_dir())['basedir'] . '/utubevideo-cache/';

    //delete video thumbnails
    foreach ($videos as $video)
      unlink($thumbnailPath . $video->VID_URL . $video->VID_ID . '.jpg');

    return $this->response(null);
  }

  public function updateItem(WP_REST_Request $req)
  {
    global $wpdb;

    //check for valid videoID
    if (!$req['albumID'])
      return $this->errorResponse('Invalid album ID');

    //gather data fields
    $albumID = sanitize_key($req['albumID']);
    $title = sanitize_text_field($req['title']);
    $thumbnail = sanitize_text_field($req['thumbnail']);

    if (isset($req['videoSorting']))
      $videoSorting = $req['videoSorting'] == 'desc' ? 'desc' : 'asc';
    else
      $videoSorting = null;

    if (isset($req['published']))
      $published = $req['published'] ? true : false;
    else
      $published = null;

    $galleryID = sanitize_key($req['galleryID']);
    $currentTime = current_time('timestamp');

    //create updatedFields array
    $updatedFields = [];

    //set optional update fields
    if ($title != null)
      $updatedFields['ALB_NAME'] = $title;

    if ($thumbnail != null)
      $updatedFields['ALB_THUMB'] = $thumbnail;

    if ($videoSorting != null)
      $updatedFields['ALB_SORT'] = $videoSorting;

    if ($published !== null)
      $updatedFields['ALB_PUBLISH'] = $published;

    if ($galleryID != null)
      $updatedFields['DATA_ID'] = $galleryID;

    //set required update fields
    $updatedFields['ALB_UPDATEDATE'] = $currentTime;

    //update database entry
    if ($wpdb->update(
      $wpdb->prefix . 'utubevideo_album',
      $updatedFields,
      ['ALB_ID' => $albumID]
    ) >= 0)
      return $this->response(null);
    else
      return $this->errorResponse('A database error has occurred');
  }

  public function getAllItems(WP_REST_Request $req)
  {
    $data = [];

    global $wpdb;
    $albums = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_album WHERE DATA_ID = ' . $req['galleryID'] . ' ORDER BY ALB_POS');

    foreach ($albums as $album)
    {
      $videoCount = $wpdb->get_results('SELECT count(VID_ID) as VIDEO_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $album->ALB_ID);

      if ($videoCount)
        $videoCount = $videoCount[0]->VIDEO_COUNT;
      else
        $videoCount = 0;

      $albumData = new stdClass();
      $albumData->id = $album->ALB_ID;
      $albumData->title = $album->ALB_NAME;
      $albumData->slug = $album->ALB_SLUG;
      $albumData->thumbnail = $album->ALB_THUMB;
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

  public function getAnyAllItems(WP_REST_Request $req)
  {
    $data = [];

    global $wpdb;
    $albums = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_album ORDER BY ALB_POS');

    foreach ($albums as $album)
    {
      $videoCount = $wpdb->get_results('SELECT count(VID_ID) as VIDEO_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $album->ALB_ID);

      if ($videoCount)
        $videoCount = $videoCount[0]->VIDEO_COUNT;
      else
        $videoCount = 0;

      $albumData = new stdClass();
      $albumData->id = $album->ALB_ID;
      $albumData->title = $album->ALB_NAME;
      $albumData->slug = $album->ALB_SLUG;
      $albumData->thumbnail = $album->ALB_THUMB;
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

  //generate album permalink slug
  public function generateSlug($albumName, $wpdb)
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
      $this->checkslug($slug, $sluglist, $mark);

    return $slug;
  }

  //recursive function for making sure slugs are unique
  private function checkslug($slug, $sluglist, $mark)
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
