<?php

namespace Dscarberry\UTubeVideoGallery\Controller\API;

use Dscarberry\UTubeVideoGallery\Controller\API\APIv1;
use Dscarberry\UTubeVideoGallery\Form\VimeoPlaylistType;
use Dscarberry\UTubeVideoGallery\Service\Factory\VimeoPlaylistFactory;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class VimeoPlaylistAPIv1 extends APIv1
{
  // register api routes
  function registerRoutes()
  {
    // get all videos in album endpoint
    register_rest_route(
      $this->namespace . '/' . $this->version,
      'vimeoplaylists/(?P<sourceID>.*)',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAllItems'],
        'args' => [
          'sourceID' => [
            'validate_callback' => 'is_numeric'
          ]
        ],
        'permission_callback' => function() {
          return current_user_can('edit_others_posts');
        }
      ]
    );
  }

  // get vimeo playlist items
  function getAllItems(WP_REST_Request $req)
  {
    try {
      $form = new VimeoPlaylistType($req);
      $form->validate();

      $playlistData = VimeoPlaylistFactory::getPlaylistData($form);

      return $this->respond($playlistData);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
