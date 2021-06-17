<?php

namespace Dscarberry\UTubeVideoGallery\Controller\API;

use Dscarberry\UTubeVideoGallery\Controller\API\APIv1;
use Dscarberry\UTubeVideoGallery\Form\VideoOrderType;
use Dscarberry\UTubeVideoGallery\Service\Factory\VideoFactory;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class VideoOrderAPIv1 extends APIv1
{
  // register api routes
  function registerRoutes()
  {
    register_rest_route(
      $this->namespace . '/' . $this->version,
      'videosorder',
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
      $form = new VideoOrderType($req);
      $form->validate();

      VideoFactory::updateVideosOrder($form);

      return $this->respond(null);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
