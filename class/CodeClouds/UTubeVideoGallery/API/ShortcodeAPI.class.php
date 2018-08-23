<?php

namespace CodeClouds\UTubeVideoGallery\API;

use WP_REST_Request;
use WP_REST_Server;

class ShortcodeAPI
{
  private $_namespace = 'utubevideogallery';
  private $_version = 'v1';

  public function registerRoutes()
  {
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'shortcodes/(?P<id>\d+)',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getShortcodeData'],
        'args' => [
          'id'
        ]
      ]
    );
  }

  public function getShortcodeData(WP_REST_Request $req)
  {
    //just sample data
    return [
      'name' => [
        'first' => 'Mr',
        'last' => 'Sir'
      ],
      'id' => $req['id']
    ];
  }

  public function hookAPI()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }
}
