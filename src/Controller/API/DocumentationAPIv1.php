<?php

namespace CodeClouds\UTubeVideoGallery\Controller\API;

use CodeClouds\UTubeVideoGallery\Controller\API\APIv1;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class DocumentationAPIv1 extends APIv1
{
  function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  // register api routes
  function registerRoutes()
  {
    // get plugin documentation markdown
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'documentation',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getDocumentation']
      ]
    );
  }

  // get plugin documentation markdown
  function getDocumentation(WP_REST_Request $req)
  {
    try {
      $readmeContent = file_get_contents(dirname(__FILE__) . '/../../../README.md');
      return $this->respond($readmeContent);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
