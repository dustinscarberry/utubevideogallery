<?php

namespace UTubeVideoGallery\Controller\API;

use UTubeVideoGallery\Controller\API\APIv1;
use UTubeVideoGallery\Form\AlbumType;
use UTubeVideoGallery\Service\Manager\AlbumManager;
use WP_REST_Request;
use WP_REST_Server;

class AlbumAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  //register api routes
  public function registerRoutes()
  {
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'galleries/(?P<galleryID>\d+)/albums',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getGalleryItems'],
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
          'callback' => [$this, 'getItems'],
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
      $form = new AlbumType($req);
      $form->validate('get');

      $album = AlbumManager::getAlbum($form->getAlbumID());

      return $this->respond($album);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //get all albums
  public function getItems(WP_REST_Request $req)
  {
    try
    {
      //get albums
      $albums = AlbumManager::getAlbums();
      return $this->respond($albums);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //get all albums within gallery
  public function getGalleryItems(WP_REST_Request $req)
  {
    try
    {
      $form = new AlbumType($req);
      $form->validate('getGallery');

      //get albums
      $albums = AlbumManager::getGalleryAlbums($form->getGalleryID());

      //respond
      return $this->respond($albums);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //create album
  public function createItem(WP_REST_Request $req)
  {
    try
    {
      $form = new AlbumType($req);
      $form->validate('create');

      AlbumManager::createAlbum($form);

      return $this->respond(null, 201);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //update album
  public function updateItem(WP_REST_Request $req)
  {
    try
    {
      $form = new AlbumType($req);
      $form->validate('update');

      AlbumManager::updateAlbum($form);

      return $this->respond(null);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  //delete album
  public function deleteItem(WP_REST_Request $req)
  {
    try
    {
      $form = new AlbumType($req);
      $form->validate('delete');

      AlbumManager::deleteAlbum($form->getAlbumID());

      return $this->respond(null);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }
}
