<?php

namespace Dscarberry\UTubeVideoGallery\Controller\API;

use WP_REST_Response;

abstract class APIv1
{
  protected $namespace = 'utubevideogallery';
  protected $version = 'v1';

  function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  abstract function registerRoutes();

  function respond($data, $code = 200)
  {
    $returnData = [];
    $returnData['data'] = $data;
    return new WP_REST_Response($returnData, $code);
  }

  function respondWithError($message, $code = 200)
  {
    $returnData = [];
    $returnData['error'] = [];
    $returnData['error']['message'] = $message;
    $returnData['error']['code'] = $code;
    return new WP_REST_Response($returnData, $code);
  }
}
