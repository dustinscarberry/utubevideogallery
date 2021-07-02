<?php

namespace Dscarberry\UTubeVideoGallery\Controller\API;

use Dscarberry\UTubeVideoGallery\Controller\API\APIv1;
use Dscarberry\UTubeVideoGallery\Form\YouTubePlaylistType;
use Dscarberry\UTubeVideoGallery\Service\Factory\YouTubePlaylistFactory;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class YouTubePlaylistAPIv1 extends APIv1
{
  // register api routes
  function registerRoutes()
  {
    register_rest_route(
      $this->namespace . '/' . $this->version,
      'youtubeplaylists/(?P<sourceID>.*)',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAllItems'],
        'args' => [
          'sourceID' => [
            'validate_callback' => function($v) {
              return true;
            }
          ]
        ],
        'permission_callback' => function() {
          return current_user_can('edit_others_posts');
        }
      ]
    );
  }

  // get all youtube playlist items
  function getAllItems(WP_REST_Request $req)
  {
    try {
      $form = new YouTubePlaylistType($req);
      $form->validate();

      $playlistData = YouTubePlaylistFactory::getPlaylistData($form);

      return $this->respond($playlistData);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
