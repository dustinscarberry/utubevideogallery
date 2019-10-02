<?php

namespace UTubeVideoGallery\Controller\API;

use UTubeVideoGallery\Controller\API\APIv1;
use UTubeVideoGallery\Form\GalleryType;
use UTubeVideoGallery\Service\Manager\GalleryManager;
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
          'callback' => [$this, 'getItems']
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
      $form = new GalleryType($req);
      $form->validate('get');

      $gallery = GalleryManager::getGallery($form->getGalleryID());

      return $this->respond($gallery);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  public function getItems(WP_REST_Request $req)
  {
    try
    {
      //get galleries
      $galleries = GalleryManager::getGalleries();

      return $this->respond($galleries);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  public function createItem(WP_REST_Request $req)
  {
    try
    {
      $form = new GalleryType($req);
      $form->validate('create');

      GalleryManager::createGallery($form);

      return $this->respond($galleryID, 201);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  public function updateItem(WP_REST_Request $req)
  {
    try
    {
      $form = new GalleryType($req);
      $form->validate('update');

      GalleryManager::updateGallery($form);

      return $this->respond(null);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  public function deleteItem(WP_REST_Request $req)
  {
    try
    {
      $form = new GalleryType($req);
      $form->validate('delete');

      GalleryManager::deleteGallery($form->getGalleryID());

      return $this->respond(null);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }
}
