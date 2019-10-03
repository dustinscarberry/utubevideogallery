<?php

namespace UTubeVideoGallery\Controller\API;

use UTubeVideoGallery\Controller\API\APIv1;
use UTubeVideoGallery\Form\PlaylistType;
use UTubeVideoGallery\Service\Manager\PlaylistManager;
use UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class PlaylistAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      '/playlists',
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
      'playlists/(?P<playlistID>\d+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'args' => [
            'playlistID'
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
            'playlistID'
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
            'playlistID'
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
      $form = new PlaylistType($req);
      $form->validate('get');

      $playlist = PlaylistManager::getPlaylist($form->getPlaylistID());

      return $this->respond($playlist);
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
      $playlists = PlaylistManager::getPlaylists();

      return $this->respond($playlists);
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
      $form = new PlaylistType($req);
      $form->validate('create');

      $playlistID = PlaylistManager::createPlaylist($form);

      return $this->respond((object)['id' => $playlistID], 201);
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
      $form = new PlaylistType($req);
      $form->validate('update');

      PlaylistManager::updatePlaylist($form);

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
      $form = new PlaylistType($req);
      $form->validate('delete');

      PlaylistManager::deletePlaylist($form->getPlaylistID());

      return $this->respond(null);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }
}
