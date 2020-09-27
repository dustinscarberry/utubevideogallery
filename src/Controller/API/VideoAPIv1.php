<?php

namespace CodeClouds\UTubeVideoGallery\Controller\API;

use CodeClouds\UTubeVideoGallery\Controller\API\APIv1;
use CodeClouds\UTubeVideoGallery\Form\VideoType;
use CodeClouds\UTubeVideoGallery\Service\Manager\VideoManager;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class VideoAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  //register api routes
  public function registerRoutes()
  {
    //get all videos in album endpoint
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'albums/(?P<albumID>\d+)/videos',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAlbumItems'],
        'args' => [
          'albumID'
        ]
      ]
    );

    //get all videos in gallery endpoint
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'galleries/(?P<galleryID>\d+)/videos',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getGalleryItems'],
        'args' => [
          'galleryID'
        ]
      ]
    );

    //create new video endpoint
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'videos',
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
          'callback' => [$this, 'getItems'],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ]
      ]

    );

    //get, update, delete video endpoints
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'videos/(?P<videoID>\d+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'args' => [
            'videoID'
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
            'videoID'
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
            'videoID'
          ],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ]
      ]
    );
  }

  //get video
  public function getItem(WP_REST_Request $req)
  {
    try
    {
      $form = new VideoType($req);
      $form->validate('get');

      $video = VideoManager::getVideo($form->getVideoID());

      return $this->respond($video);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //get all videos
  public function getItems(WP_REST_Request $req)
  {
    try
    {
      //get videos
      $videos = VideoManager::getVideos();
      return $this->respond($videos);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //get all videos within album
  public function getAlbumItems(WP_REST_Request $req)
  {
    try
    {
      $form = new VideoType($req);
      $form->validate('getAlbum');

      //get videos
      $videos = VideoManager::getAlbumVideos($form->getAlbumID());

      //respond
      return $this->respond($videos);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //get all videos within gallery
  public function getGalleryItems(WP_REST_Request $req)
  {
    try
    {
      $form = new VideoType($req);
      $form->validate('getGallery');

      //get videos
      $videos = VideoManager::getGalleryVideos($form->getGalleryID());

      //respond
      return $this->respond($videos);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //create video
  public function createItem(WP_REST_Request $req)
  {
    try
    {
      $form = new VideoType($req);
      $form->validate('create');

      if (VideoManager::createVideo($form))
        return $this->respond(null, 201);
      else
        return $this->respondWithError(__('An unknown error has occurred', 'utvg'));
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //update video
  public function updateItem(WP_REST_Request $req)
  {
    try
    {
      $form = new VideoType($req);
      $form->validate('update');

      VideoManager::updateVideo($form);
      return $this->respond(null);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //delete video
  public function deleteItem(WP_REST_Request $req)
  {
    try
    {
      $form = new VideoType($req);
      $form->validate('delete');

      VideoManager::deleteVideo($form->getVideoID());
      return $this->respond(null);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }
}
