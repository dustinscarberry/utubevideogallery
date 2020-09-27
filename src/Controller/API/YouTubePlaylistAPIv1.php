<?php

namespace CodeClouds\UTubeVideoGallery\Controller\API;

use CodeClouds\UTubeVideoGallery\Controller\API\APIv1;
use CodeClouds\UTubeVideoGallery\Form\YouTubePlaylistType;
use CodeClouds\UTubeVideoGallery\Service\Manager\YouTubePlaylistManager;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class YouTubePlaylistAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    //get all videos in album endpoint
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'youtubeplaylists/(?P<sourceID>.*)',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAllItems'],
        'args' => [
          'sourceID'
        ],
        'permission_callback' => function()
        {
          return current_user_can('edit_others_posts');
        }
      ]
    );
  }

  public function getAllItems(WP_REST_Request $req)
  {
    try
    {
      $form = new YouTubePlaylistType($req);
      $form->validate();

      $playlistData = YouTubePlaylistManager::getPlaylistData($form);

      return $this->respond($playlistData);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }
}
