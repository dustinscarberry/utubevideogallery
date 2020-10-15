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
  // register api routes
  function registerRoutes()
  {
    register_rest_route(
      $this->namespace . '/' . $this->version,
      'albumsorder',
      [
        'methods' => 'PATCH',
        'callback' => [$this, 'updateItem'],
        'permission_callback' => function() {
          return current_user_can('edit_others_posts');
        }
      ]
    );
  }

  function updateItem(WP_REST_Request $req)
  {
    try {
      $form = new AlbumOrderType($req);
      $form->validate();

      AlbumManager::updateAlbumsOrder($form);

      return $this->respond(null);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
