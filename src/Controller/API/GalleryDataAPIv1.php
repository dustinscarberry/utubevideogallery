<?php

namespace CodeClouds\UTubeVideoGallery\Controller\API;

use CodeClouds\UTubeVideoGallery\Controller\API\APIv1;
use CodeClouds\UTubeVideoGallery\Form\GalleryDataType;
use CodeClouds\UTubeVideoGallery\Service\Factory\GalleryDataFactory;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;
use WP_REST_Server;

class GalleryDataAPIv1 extends APIv1
{
  // register api routes
  function registerRoutes()
  {
    register_rest_route(
      $this->namespace . '/' . $this->version,
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

  function getItem(WP_REST_Request $req)
  {
    try {
      $form = new GalleryDataType($req);
      $form->validate();

      $galleryData = GalleryDataFactory::getGalleryData($form);

      return $this->respond($galleryData);
    } catch (UserMessageException $e) {
      return $this->respondWithError($e->getMessage());
    }
  }
}
