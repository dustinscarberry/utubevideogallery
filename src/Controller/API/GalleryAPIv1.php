<?php

namespace Dscarberry\UTubeVideoGallery\Controller\API;

use Dscarberry\UTubeVideoGallery\Controller\API\APIv1;
use Dscarberry\UTubeVideoGallery\Form\GalleryType;
use Dscarberry\UTubeVideoGallery\Service\Factory\GalleryFactory;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class GalleryAPIv1 extends APIv1
{
  // register api routes
  function registerRoutes()
  {
    register_rest_route(
      $this->namespace . '/' . $this->version,
      '/galleries',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItems']
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'createItem'],
          'permission_callback' => function() {
            return current_user_can('edit_others_posts');
          }
        ]
      ]
    );

    register_rest_route(
      $this->namespace . '/' . $this->version,
      'galleries/(?P<galleryID>\d+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'args' => [
            'galleryID'
          ],
          'permission_callback' => function() {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'deleteItem'],
          'args' => [
            'galleryID'
          ],
          'permission_callback' => function() {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => 'PATCH',
          'callback' => [$this, 'updateItem'],
          'args' => [
            'galleryID'
          ],
          'permission_callback' => function() {
            return current_user_can('edit_others_posts');
          }
        ]
      ]
    );
  }

  function getItem(WP_REST_Request $req)
  {
    try {
      $form = new GalleryType($req);
      $form->validate('get');

      $gallery = GalleryFactory::getGallery($form->getGalleryID());

      return $this->respond($gallery);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  function getItems(WP_REST_Request $req)
  {
    try {
      //get galleries
      $galleries = GalleryFactory::getGalleries();

      return $this->respond($galleries);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  function createItem(WP_REST_Request $req)
  {
    try {
      $form = new GalleryType($req);
      $form->validate('create');

      GalleryFactory::createGallery($form);

      return $this->respond($galleryID, 201);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  function updateItem(WP_REST_Request $req)
  {
    try {
      $form = new GalleryType($req);
      $form->validate('update');

      GalleryFactory::updateGallery($form);

      return $this->respond(null);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  function deleteItem(WP_REST_Request $req)
  {
    try {
      $form = new GalleryType($req);
      $form->validate('delete');

      GalleryFactory::deleteGallery($form->getGalleryID());

      return $this->respond(null);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
