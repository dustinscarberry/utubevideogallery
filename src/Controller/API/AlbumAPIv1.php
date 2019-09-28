<?php

namespace UTubeVideoGallery\Controller\API;

use UTubeVideoGallery\Controller\API\APIv1;
use UTubeVideoGallery\Repository\AlbumRepository;
use UTubeVideoGallery\Repository\VideoRepository;
use WP_REST_Request;
use WP_REST_Server;

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

  //get single album
  public function getItem(WP_REST_Request $req)
  {
    try
    {
      //check for valid albumID
      if (!$req['albumID'])
        return $this->errorResponse(__('Invalid album ID', 'utvg'));

      //sanitize data
      $albumID = sanitize_key($req['albumID']);

      //get album
      $album = AlbumRepository::getItem($albumID);

      //check if album exists
      if (!$album)
        return $this->errorResponse(__('The specified album resource was not found', 'utvg'));

      return $this->response($album);
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  //create album
  public function createItem(WP_REST_Request $req)
  {
    try
    {
      //gather data fields
      $title = sanitize_text_field($req['title']);
      $videoSorting = ($req['videoSorting'] == 'desc' ? 'desc' : 'asc');
      $galleryID = sanitize_key($req['galleryID']);

      //check for required fields
      if (empty($title) || empty($videoSorting) || !isset($galleryID))
        throw new \Exception(__('Invalid parameters', 'utvg'));
        //return $this->errorResponse(__('Invalid parameters', 'utvg'));

      //get next album sort position
      $nextSortPosition = AlbumRepository::getNextSortPositionByGallery($galleryID);

      //generate slug and store for possible use in future
      $slug = $this->generateSlug($title, $wpdb);

      //insert new album
      $albumID = AlbumRepository::createItem(
        $title,
        $slug,
        $videoSorting,
        $nextSortPosition,
        $galleryID
      );

      //if successfull album creation..
      if ($albumID)
        return $this->response(null, 201);
      else
        return $this->errorResponse(__('A database error has occurred', 'utvg'));
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  //delete album
  public function deleteItem(WP_REST_Request $req)
  {
    try
    {
      //check for valid albumID
      if (!$req['albumID'])
        return $this->errorResponse(__('Invalid album ID', 'utvg'));

      //sanitize fields
      $albumID = sanitize_key($req['albumID']);

      //get all videos in album
      $albumVideos = VideoRepository::getItemsByAlbum($albumID);

      //delete album and videos from database
      if (
        !VideoRepository::deleteItemsByAlbum($albumID)
        || !AlbumRepository::deleteItem($albumID)
      )
        return $this->errorResponse(__('A database error has occurred', 'utvg'));

      //delete thumbnails
      $thumbnailPath = wp_upload_dir();
      $thumbnailPath = $thumbnailPath['basedir'] . '/utubevideo-cache/';

      //delete video thumbnails
      foreach ($videos as $video)
      {
        unlink($thumbnailPath . $video->getThumbnail() . '.jpg');
        unlink($thumbnailPath . $video->getThumbnail() . '@2x.jpg');
      }

      return $this->response(null);
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  //update album
  public function updateItem(WP_REST_Request $req)
  {
    try
    {
      //check for valid albumID
      if (!$req['albumID'])
        return $this->errorResponse(__('Invalid album ID', 'utvg'));

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

      //update album
      if (AlbumRepository::updateItem($albumID, $updatedFields))
        return $this->response(null);
      else
        return $this->errorResponse(__('A database error has occurred', 'utvg'));
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  //get list of albums within gallery
  public function getAllItems(WP_REST_Request $req)
  {
    try
    {
      //check for valid gallery id
      if (!$req['galleryID'])
        return $this->errorResponse(__('Invalid gallery ID', 'utvg'));

      //sanitize data
      $galleryID = sanitize_key($req['galleryID']);

      //get albums
      $albums = AlbumRepository::getItemsByGallery($galleryID);

      return $this->response($albums);
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  //get list of all albums
  public function getAnyAllItems(WP_REST_Request $req)
  {
    try
    {
      //get albums
      $albums = AlbumRepository::getItems();

      return $this->response($albums);
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  //generate album permalink slug
  public function generateSlug($albumName, $wpdb)
  {
    global $wpdb;

    $rawslugs = $wpdb->get_results(
      'SELECT ALB_SLUG
      FROM ' . $wpdb->prefix . 'utubevideo_album',
      ARRAY_N
    );

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
