<?php

namespace Dscarberry\UTubeVideoGallery\Controller\API;

use Dscarberry\UTubeVideoGallery\Controller\API\APIv1;
use Dscarberry\UTubeVideoGallery\Form\VideoType;
use Dscarberry\UTubeVideoGallery\Service\Factory\VideoFactory;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class VideoAPIv1 extends APIv1
{
  // register api routes
  function registerRoutes()
  {
    // get all videos in album endpoint
    register_rest_route(
      $this->namespace . '/' . $this->version,
      'albums/(?P<albumID>\d+)/videos',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAlbumItems'],
        'args' => [
          'albumID' => [
            'validate_callback' => 'is_numeric'
          ]
        ]
      ]
    );

    // get all videos in gallery endpoint
    register_rest_route(
      $this->namespace . '/' . $this->version,
      'galleries/(?P<galleryID>\d+)/videos',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getGalleryItems'],
        'args' => [
          'galleryID' => [
            'validate_callback' => 'is_numeric'
          ]
        ]
      ]
    );

    // create new video endpoint
    register_rest_route(
      $this->namespace . '/' . $this->version,
      'videos',
      [
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'createItem'],
          'permission_callback' => function() {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItems'],
          'permission_callback' => function() {
            return current_user_can('edit_others_posts');
          }
        ]
      ]

    );

    // get, update, delete video endpoints
    register_rest_route(
      $this->namespace . '/' . $this->version,
      'videos/(?P<videoID>\d+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'args' => [
            'videoID' => [
              'validate_callback' => 'is_numeric'
            ]
          ],
          'permission_callback' => function() {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'deleteItem'],
          'args' => [
            'videoID' => [
              'validate_callback' => 'is_numeric'
            ]
          ],
          'permission_callback' => function() {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => 'PATCH',
          'callback' => [$this, 'updateItem'],
          'args' => [
            'videoID' => [
              'validate_callback' => 'is_numeric'
            ]
          ],
          'permission_callback' => function() {
            return current_user_can('edit_others_posts');
          }
        ]
      ]
    );
  }

  // get video
  function getItem(WP_REST_Request $req)
  {
    try {
      $form = new VideoType($req);
      $form->validate('get');

      $video = VideoFactory::getVideo($form->getVideoID());

      return $this->respond($video);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // get all videos
  function getItems(WP_REST_Request $req)
  {
    try {
      $videos = VideoFactory::getVideos();
      return $this->respond($videos);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // get all videos within album
  function getAlbumItems(WP_REST_Request $req)
  {
    try {
      $form = new VideoType($req);
      $form->validate('getAlbum');

      //get videos
      $videos = VideoFactory::getAlbumVideos($form->getAlbumID());

      //respond
      return $this->respond($videos);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // get all videos within gallery
  function getGalleryItems(WP_REST_Request $req)
  {
    try {
      $form = new VideoType($req);
      $form->validate('getGallery');

      // get videos
      $videos = VideoFactory::getGalleryVideos($form->getGalleryID());

      return $this->respond($videos);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // create video
  function createItem(WP_REST_Request $req)
  {
    try {
      $form = new VideoType($req);
      $form->validate('create');

      if (VideoFactory::createVideo($form))
        return $this->respond(null, 201);
      else
        return $this->respondWithError(__('An unknown error has occurred', 'utvg'));
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // update video
  function updateItem(WP_REST_Request $req)
  {
    try {
      $form = new VideoType($req);
      $form->validate('update');

      VideoFactory::updateVideo($form);
      return $this->respond(null);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // delete video
  function deleteItem(WP_REST_Request $req)
  {
    try {
      $form = new VideoType($req);
      $form->validate('delete');

      VideoFactory::deleteVideo($form->getVideoID());
      return $this->respond(null);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
