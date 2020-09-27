<?php

namespace CodeClouds\UTubeVideoGallery\Controller\API;

use CodeClouds\UTubeVideoGallery\Controller\API\APIv1;
use CodeClouds\UTubeVideoGallery\Form\GalleryDataType;
use CodeClouds\UTubeVideoGallery\Service\Manager\GalleryDataManager;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class GalleryDataAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      '/galleriesdata/(?P<galleryID>\d+)',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getItem'],
        'args' => [
          'galleryID'
        ]
      ]
    );
  }

  public function getItem(WP_REST_Request $req)
  {
    try
    {
      $form = new GalleryDataType($req);
      $form->validate();

      $galleryData = GalleryDataManager::getGalleryData($form);

      return $this->respond($galleryData);
    }
    catch (UserMessageException $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }
}
