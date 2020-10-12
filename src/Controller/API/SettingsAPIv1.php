<?php

namespace CodeClouds\UTubeVideoGallery\Controller\API;

use CodeClouds\UTubeVideoGallery\Controller\API\APIv1;
use CodeClouds\UTubeVideoGallery\Model\Settings;
use CodeClouds\UTubeVideoGallery\Service\Manager\SettingsManager;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class SettingsAPIv1 extends APIv1
{
  function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  // register api routes
  function registerRoutes()
  {
    // get, update settings endpoints
    register_rest_route(
      $this->namespace . '/' . $this->version,
      'settings',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => 'PATCH',
          'callback' => [$this, 'updateItem'],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ]
      ]
    );
  }

  // get plugin settings
  function getItem(WP_REST_Request $req)
  {
    try {
      return $this->respond(SettingsManager::getSettings());
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // update plugin settings
  public function updateItem(WP_REST_Request $req)
  {
    try {
      SettingsManager::updateSettings($req);

      return $this->respond(null);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
