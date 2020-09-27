<?php

namespace CodeClouds\UTubeVideoGallery\Controller\API;

use CodeClouds\UTubeVideoGallery\Controller\API\APIv1;
use CodeClouds\UTubeVideoGallery\Form\AlbumOrderType;
use CodeClouds\UTubeVideoGallery\Service\Manager\AlbumManager;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class AlbumOrderAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    //get, update, delete video endpoints
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'albumsorder',
      [
        'methods' => 'PATCH',
        'callback' => [$this, 'updateItem'],
        'permission_callback' => function()
        {
          return current_user_can('edit_others_posts');
        }
      ]
    );
  }

  public function updateItem(WP_REST_Request $req)
  {
    try
    {
      $form = new AlbumOrderType($req);
      $form->validate();

      AlbumManager::updateAlbumsOrder($form);

      return $this->respond(null);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }
}
