<?php

namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use CodeClouds\UTubeVideoGallery\Repository\GalleryRepository;
use CodeClouds\UTubeVideoGallery\Repository\AlbumRepository;
use CodeClouds\UTubeVideoGallery\Repository\VideoRepository;
use WP_REST_Request;
use WP_REST_Server;

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
    try
    {
      //check for valid galleryID
      if (!$req['galleryID'])
        return $this->errorResponse(__('Invalid gallery ID', 'utvg'));

      //sanitize data
      $galleryID = sanitize_key($req['galleryID']);

      //get gallery
      $galleryRepository = new GalleryRepository();
      $gallery = $galleryRepository->getItem($galleryID);

      if (!$gallery)
        return $this->errorResponse(__('The specified gallery resource was not found', 'utvg'));

      return $this->response($gallery);
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  public function createItem(WP_REST_Request $req)
  {
    try
    {
      //gather data fields
      $title = sanitize_text_field($req['title']);
      $albumSorting = sanitize_text_field($req['albumSorting'] == 'desc' ? 'desc' : 'asc');
      $thumbnailType = sanitize_text_field($req['thumbnailType'] == 'square' ? 'square' : 'rectangle');
      $displayType = sanitize_text_field($req['displayType'] == 'video' ? 'video' : 'album');

      //check for required fields
      if (
        empty($title)
        || empty($albumSorting)
        || empty($thumbnailType)
        || empty($displayType)
      )
        return $this->errorResponse(__('Invalid parameters', 'utvg'));

      //insert new gallery
      $galleryRepository = new GalleryRepository();
      $galleryID = $galleryRepository->createItem(
        $title,
        $albumSorting,
        $thumbnailType,
        $displayType
      );

      if ($galleryID)
        return $this->response($galleryID, 201);
      else
        return $this->errorResponse(__('A database error has occurred', 'utvg'));
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }

  }

  public function deleteItem(WP_REST_Request $req)
  {
    try
    {
      //check for valid galleryID
      if (!$req['galleryID'])
        return $this->errorResponse(__('Invalid gallery ID', 'utvg'));

      //sanitize fields
      $galleryID = sanitize_key($req['galleryID']);

      //create repositories
      $galleryRepository = new GalleryRepository();
      $albumRepository = new AlbumRepository();
      $videoRepository = new VideoRepository();

      //get videos for thumbnail deletion
      $videos = $videoRepository->getItemsByGallery($galleryID);

      //delete gallery, albums, and videos from database
      if (
        !$videoRepository->deleteItemsByGallery($galleryID)
        || !$albumRepository->deleteItemsByGallery($galleryID)
        || !$galleryRepository->deleteItem($galleryID)
      )
        return $this->errorResponse(__('A database error has occured', 'utvg'));

      //delete video thumbnails
      $thumbnailPath = wp_upload_dir();
      $thumbnailPath = $thumbnailPath['basedir'] . '/utubevideo-cache/';

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

  public function updateItem(WP_REST_Request $req)
  {
    try
    {
      //check for valid galleryID
      if (!$req['galleryID'])
        return $this->errorResponse(__('Invalid gallery ID', 'utvg'));

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

      //update gallery
      $galleryRepository = new GalleryRepository();

      if ($galleryRepository->updateItem($galleryID, $updatedFields))
        return $this->response(null);
      else
        return $this->errorResponse(__('A database error has occurred', 'utvg'));
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }

  public function getAllItems(WP_REST_Request $req)
  {
    try
    {
      //get galleries
      $galleryRepository = new GalleryRepository();
      $galleries = $galleryRepository->getItems();

      return $this->response($galleries);
    }
    catch (\Exception $e)
    {
      return $this->errorResponse($e->getMessage());
    }
  }
}
