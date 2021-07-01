<?php

namespace Dscarberry\UTubeVideoGallery\Controller\API;

use Dscarberry\UTubeVideoGallery\Controller\API\APIv1;
use Dscarberry\UTubeVideoGallery\Form\AlbumType;
use Dscarberry\UTubeVideoGallery\Service\Factory\AlbumFactory;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class AlbumAPIv1 extends APIv1
{
  // register api routes
  function registerRoutes()
  {
    register_rest_route(
      $this->namespace . '/' . $this->version,
      'galleries/(?P<galleryID>\d+)/albums',
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

    register_rest_route(
      $this->namespace . '/' . $this->version,
      'albums',
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

    register_rest_route(
      $this->namespace . '/' . $this->version,
      'albums/(?P<albumID>\d+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'args' => [
            'albumID' => [
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
            'albumID' => [
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
            'albumID' => [
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

  // get single album
  function getItem(WP_REST_Request $req)
  {
    try {
      $form = new AlbumType($req);
      $form->validate('get');

      $album = AlbumFactory::getAlbum($form->getAlbumID());

      return $this->respond($album);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // get all albums
  function getItems(WP_REST_Request $req)
  {
    try {
      $albums = AlbumFactory::getAlbums();
      return $this->respond($albums);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // get all albums within gallery
  function getGalleryItems(WP_REST_Request $req)
  {
    try {
      $form = new AlbumType($req);
      $form->validate('getGallery');

      //get albums
      $albums = AlbumFactory::getGalleryAlbums($form->getGalleryID());

      //respond
      return $this->respond($albums);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // create album
  function createItem(WP_REST_Request $req)
  {
    try {
      $form = new AlbumType($req);
      $form->validate('create');

      AlbumFactory::createAlbum($form);

      return $this->respond(null, 201);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // update album
  function updateItem(WP_REST_Request $req)
  {
    try {
      $form = new AlbumType($req);
      $form->validate('update');

      AlbumFactory::updateAlbum($form);

      return $this->respond(null);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // delete album
  function deleteItem(WP_REST_Request $req)
  {
    try {
      $form = new AlbumType($req);
      $form->validate('delete');

      AlbumFactory::deleteAlbum($form->getAlbumID());

      return $this->respond(null);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
