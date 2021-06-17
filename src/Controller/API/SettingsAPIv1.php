<?php

namespace Dscarberry\UTubeVideoGallery\Controller\API;

use Dscarberry\UTubeVideoGallery\Controller\API\APIv1;
use Dscarberry\UTubeVideoGallery\Model\Settings;
use Dscarberry\UTubeVideoGallery\Service\Factory\SettingsFactory;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class SettingsAPIv1 extends APIv1
{
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
          'permission_callback' => function() {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => 'PATCH',
          'callback' => [$this, 'updateItem'],
          'permission_callback' => function() {
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
      return $this->respond(SettingsFactory::getSettings());
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }

  // update plugin settings
  function updateItem(WP_REST_Request $req)
  {
    try {
      SettingsFactory::updateSettings($req);
      return $this->respond(null);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
