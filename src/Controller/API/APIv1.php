<?php

namespace UTubeVideoGallery\Controller\API;

use WP_REST_Response;

class APIv1
{
  protected $_namespace = 'utubevideogallery';
  protected $_version = 'v1';

  public function respond($data, $code = 200)
  {
    $returnData = new \stdClass();
    $returnData->data = $data;
    return new WP_REST_Response($returnData, $code);
  }

  public function respondWithError($message, $code = 200)
  {
    $returnData = new \stdClass();
    $returnData->error = new \stdClass();
    $returnData->error->message = $message;
    $returnData->error->code = $code;
    return new WP_REST_Response($returnData, $code);
  }
}
